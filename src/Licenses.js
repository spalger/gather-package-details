import { fromCallback as fcb } from 'bluebird'
import { map, mapValues, find } from 'lodash'
import checker from 'license-checker'

export class Licenses {
  constructor(projectRoot, overrides) {
    this.start = projectRoot
    this.all = overrides ? this.toLicenseList(overrides) : []
  }

  async init() {
    const checkerResults = await fcb(cb => {
      // note that the err and callback are switched here
      checker.init({ start: this.start }, (d, err) => cb(err, d))
    })
    const licenseMap = mapValues(checkerResults, 'licenses')
    this.all = this.all.concat(this.toLicenseList(licenseMap))
  }

  forModule(name, version) {
    const match = find(this.all, { name, version })

    if (!match) {
      return ['UNKNOWN']
    }

    return match.licenses
  }

  /**
   * Parse a map of licenses from a license map, which is on object with
   * checkId's for keys and license names for values into an array of
   * objects with name, version, and licenses properties
   *
   * @param  {Object} licenseMap - map of checkId's to licenses
   * @return {Array}
   */
  toLicenseList(licenseMap) {
    return map(licenseMap, (rawLicenses, id) => {
      const { name, version } = this.parseCheckId(id)
      const licenses = [].concat(rawLicenses) // force licenses to be an array
      return { name, version, licenses }
    })
  }

  /**
   * Parse a check id into it's module namd and version. Check id's are
   * strings in the format "{moduleName}@{moduleVersion}"
   *
   * @param  {string} id - check id
   * @return {object} - { name: string , version: string }
   */
  parseCheckId(id) {
    const idParts = id.split('@')
    if (idParts.length === 3 && idParts[0] === '') {
      // scoped module, like @org/package@version, replace
      // rejoin the first two element
      idParts.splice(0, 2, `@${idParts[1]}`)
    }

    if (idParts.length !== 2) {
      throw new TypeError(`unable to parse id passed back by license-checker: ${id}`)
    }

    return { name: idParts[0], version: idParts[1] }
  }

}
