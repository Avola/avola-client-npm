![alt text][logo]
# avola-client :package: 
Avola Decision client to execute and synchronize your decisions. NPM version.             

[logo]: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJcAAAA6CAMAAACKwzt7AAAAY1BMVEX////LODfIJSTKMC/03d3ZennJKinuysrioJ/x09PIIR/99/fz2dnLNjXkpKT68PDqvb324+PUZGTkqKfQVVTHFxXpt7fnsbDbg4Pdiorhm5vsxMPWb27OTEvSXFvekJDFBwJ4Cq5MAAABWklEQVRoge3ZYW+CQAwG4OOqh6KgzIFuDsf//5VLdq3LSs6WzTFi+n4TX8oDiQcRl80z7r8BiZhrXMw1LrN3BS9F3yzVTZ7AXeFYL4QgLLRScwsR5vfiTJb6GJjL505Kgc21VNyE6CoW4kye3E/h2prLXOa6jyvfx1x/7EnXmTXTLiy2NTVb3LDRuy7F5wrcrERXh81KdPnY7Fv8vOvjMt8TVOF6isMDHS3tesbmQXRldCMgFzKKMS4wl7nMZS5zmctcj+fSP+dM69ph6OFuLi4ec5nLXL90DY5GLlot9S6X/J+JXGc6A+5acxecVt9TdXEGvFW4BVKuA9v1FZvwwmeiC5YVa75j4wTMlUFgKfkXySvbebbr6JnXDcT6wf++yfvjXWMuc/2pC9QRXaV+lhi3VAdhg/cKNa505UU/Sww/9xtp8IIN3q7g5fq6M0ybJrsdc5nLXA/q+gBMIDrCDomweAAAAABJRU5ErkJggg== "Npm logo"

## Installation 
```sh
npm install avola-client --save
yarn add avola-client
bower install avola-client --save
```
## Usage
### Javascript
```javascript
var avola = require('avola').Avola;

// Create client with base url of the Avola Decision api and your apikey
var avolaclient = new avola.AvolaClient('https://free.api.avo.la', 'replacewithclientid', 
                                               'replacewithclientsecret', 'optionaltokenhost');

client.getSettings().then((settings) => {
  console.log("settings", settings);
  var mysettings = settings;
});
```

### TypeScript
```typescript
import { AvolaClient } from 'avola';

let avolaclient = new Avolaclient('https://free.api.avo.la', 'replacewithclientid',
                                              'replacewithclientsecret', 'optionaltokenhost');

avolaclient.getSettings().then((settings) => {
  console.log("settings", settings);
  let mysettings = settings;
});
```

```sh
Output should be the settings of the Api
```
### Available methods

| name          | description   | In Free?  |
| ------------- |:-------------:| ---------:|
| getSettings()      | Will return the settings of the API. This describes certain endpoints and info. |  :white_check_mark:    |
| getDecisionServices(decisionServiceId?: number)      | Will return you the list and details of all decision services and their version without parameters. With decisionServiceId: will return you the versions and details of a specific decision service.      |        |
| getDecisionServiceVersions(decisionServiceId: number, version: number) | Will return you the details of a specific decision service version.      |        |
| executeDecisionServiceVersion(executionRequest: Execution.ApiExecutionRequest)      | Execute a descision service version, this returns all conclusions, from all decisions in the decision service. |      |
| executeDecisionTable(executionRequest: Execution.ApiExecutionRequest)      | Execute a decision table. This function is only available if you are using a Free api client. |  :white_check_mark:    |

## Contribute :star: :star: :star:
Want to contribute to this package?
1) Clone the repo

2) Install dependencies
```sh
npm install
```
3) Edit files in lib/

4) Build
```sh
npm run build
```
5) Create a pull request

### Test & Build
```sh
npm run test
```

To build and run the tests
```sh
npm run buildtest
```