# gather-package-details

Given the directory of a project utilizing npm and a list of file paths, collect package information pertaining to each path.

# install

```sh
npm install gather-package-details
```

# usage

This module exports a single function, `gatherPackageDetails()`, which takes an options object. The following options can/must be specified:

 - `projectRoot` - ***required***, path to the root of the project which is being investigated
 - `modulePaths` - ***required***, an array of paths to files that should be traced back to packages
 - `licenseOverrides` - an optional map of license names for specific packages. The keys of this object should be formatted as `name@version`, and the values can be any value

The method returns a promise for the details, `{ project, unresolved }`

 - `details.project` - the root package, or project package, which is the parent to all of the discovered packages. See [`Package`](#package) for details about it's properties
 - `details.unresolved` - an array of the `modulePaths` that could not be matched to a package

# examples

See the examples directory for usage:

 - [licenses for webpack build](examples/licenses-for-webpack-build)

# Package

The `Package` class represents a node package, identified by a directory containing a package.json file. Each package has the following properties:

 - `name` - the name of the package
 - `version` - the version, read from the package.json file
 - `directory` - the directory where the package was found
 - `licenses` - An array of license identifiers which this package advertises, or the values passed in via the `licenseOverrides` option.
 - `children` - An array of sub-`Package`s that were found
