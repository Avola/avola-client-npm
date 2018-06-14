# avola-client :package:
Avola Decision client to execute and synchronize your decisions. NPM version.

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
var avolaclient = new avola.AvolaClient('https://free.api.avo.la', 'replacewithclientid', 'replacewithclientsecret', 'optionaltokenhost');

client.getSettings().then((settings) => {
  console.log("settings", settings);
  var mysettings = settings;
});
```

### TypeScript
```typescript
import { AvolaClient } from 'avola';

let avolaclient = new Avolaclient('https://free.api.avo.la', 'replacewithclientid', 'replacewithclientsecret', 'optionaltokenhost');

avolaclient.getSettings().then((settings) => {
  console.log("settings", settings);
  let mysettings = settings;
});
```

```sh
Output should be the settings of the Api
```

## Contribute
Want to contribute to this package?
1) Clone the repo

2)
```sh
npm install
```
3) Edit files in lib/

4) Build
```sh
npm run build
```

### Test & Build
```sh
npm run test
```

To build and run the tests
```sh
npm run buildtest
```