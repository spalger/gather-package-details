This example runs a webpack build and then passes the resource location of each module included in the build to gather-package-details. These modules are then resolved to packages and the license information for each package is logged.

Run this example with `npm run babel examples/licenses-for-webpack-build` from the root of the project to see the output, but it should look like this:

```sh
$ npm run babel examples/licenses-for-webpack-build

> gather-package-details@0.0.1 babel ~/dev/gather-package-details
> babel-node "examples/licenses-for-webpack-build"

package "@gather-package-details/examples" version 1.2.0 uses the following license(s) MIT*
package "jquery" version 3.0.0 uses the following license(s) MIT
package "lodash" version 4.13.1 uses the following license(s) MIT
package "webpack" version 1.13.1 uses the following license(s) MIT
```
