/* eslint-disable no-console */

import gatherPackageDetails from '../../src'
import webpack from 'webpack'

import webpackConfig from './webpack.config.js'

const projectRoot = __dirname

const runWebpackBuild = () => new Promise((resolve, reject) => {
  const compiler = webpack(webpackConfig)
  compiler.run((err, stats) => {
    if (err) reject(err)
    else resolve(stats)
  })
})

const getBuildFiles = stats =>
  stats.compilation.modules
    .map(m => m.resource)
    .filter(Boolean)

runWebpackBuild()
.then(getBuildFiles)
.then(modulePaths =>
  gatherPackageDetails({
    projectRoot,
    modulePaths,
  })
)
.then(details => {
  const { project, unresolved } = details

  if (unresolved) {
    throw new TypeError('some modules could not be resolved!', unresolved)
  }

  // recurse through children to log license information
  (function step(pkg) {
    console.log(
      'package %j version %s uses the following license(s) %s',
      pkg.name,
      pkg.version,
      pkg.licenses
    )

    pkg.children.forEach(step)
  }(project))
})
.catch(console.error)
