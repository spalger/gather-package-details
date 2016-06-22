import { fromCallback as fcb } from 'bluebird'
import readPackageTree from 'read-package-tree'

import { Package } from './Package'
import { ModulePaths } from './ModulePaths'
import { Licenses } from './Licenses'

export const gather = async (opts) => {
  if (!opts) {
    throw new TypeError('gather requires an options object with at least `projectRoot` set')
  }

  const {
    projectRoot = null,
    modulePaths: rawModulePaths = [],
    licenseOverrides = {},
  } = opts

  if (!projectRoot) {
    throw new TypeError('`projectRoot` is a required option')
  }

  if (!Array.isArray(rawModulePaths)) {
    throw new TypeError('`modulePaths` should be an array of module paths')
  }

  if (typeof licenseOverrides !== 'object') {
    throw new TypeError(
      '`licenseOverrides` should be a map of `module@version` to license information'
    )
  }

  const modulePaths = new ModulePaths(rawModulePaths)
  const licenses = new Licenses(projectRoot, licenseOverrides)
  await licenses.init()
  const pkgTree = await fcb(cb => readPackageTree(projectRoot, undefined, cb))
  const project = new Package(pkgTree, licenses, modulePaths)
  const unclaimed = modulePaths.getUnclaimed()

  return {
    project,
    unresolved: unclaimed.length ? unclaimed : null,
  }
}
