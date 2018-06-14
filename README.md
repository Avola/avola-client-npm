<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Npm-logo.svg/2000px-Npm-logo.svg.png" alt="npm logo" width="150" height="50" />

# avola-client :package: 
Avola Decision client package to execute and synchronize your decisions with an ease. This package is for any developer looking for an easy solution to connect Avola Decision to their software. Also check out our other packages and definitely [read our api documentation](https://docs.avo.la) if something is not clear.

## Requirements
* A valid Avola Decision account - don't have an account? Find out the very basics [by creating a free account](https://free.avo.la)
* In Avola, you need to create an API account (save the clientid and secret) - For free user check the my account page
* Your custom company endpoint ex: https://companyxyz.api.avo.la - For free user: https://free.api.avo.la
* Your token host: you can find this at /api/settings on your custom company api endpoint - For free user it is optional and already defaults to https://free.auth.avo.la

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
| executeDecisionFree(executionRequest: Execution.ApiExecutionRequest)      | Execute a decision. This function is only available if you are a Free user and doesn't support the full power of versioned execution. |  :white_check_mark:    |

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