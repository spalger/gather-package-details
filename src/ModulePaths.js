import { difference } from 'lodash'
import { sep, relative } from 'path'

const IN_SUB_PACKAGE_RE = new RegExp(`(?:^|\\${sep})node_modules\\${sep}?`)

export class ModulePaths {
  constructor(unclaimed) {
    this.all = unclaimed.slice()
    this.claimed = []
  }

  claimByDir(dir) {
    const claims = this.getUnclaimed().filter(path => {
      const rel = relative(dir, path)

      // if the relative path starts with '..' it is outside
      // of this directory, so it's not "ours"
      if (rel.startsWith('..')) return false

      // if the relative path is within a sub package
      // path belongs to that package, not this one
      if (IN_SUB_PACKAGE_RE.test(rel)) return false

      return true
    })

    this.claimed.push(...claims)

    return claims
  }

  getUnclaimed() {
    return difference(this.all, this.claimed)
  }
}
