# avola-client : NPM Version
Avola Decision client to execute and synchronize your decisions

## Installation 
```sh
npm install avola-client --save
yarn add avola-client
bower install avola-client --save
```
## Usage
### Javascript
```javascript
var AvolaClient = require('avolaclient');

// Create client with base url of the Avola Decision api and your apikey
var avolaclient = new AvolaClient('https://free.api.avo.la', 'replacewithapikey');

client.getSettings().then((settings) => {
  console.log("settings", settings);
  var mysettings = settings;
});
```

### TypeScript
```typescript
import { AvolaClient } from 'avolaclient';

let avolaclient = new Avolaclient('https://free.api.avo.la', 'replacewithapikey');

avolaclient.getSettings().then((settings) => {
  console.log("settings", settings);
  let mysettings = settings;
});
```

```sh
Output should be the settings of the Api
```
### AMD
```javascript
define(function(require,exports,module){
  var pluralise = require('mypluralize');
});
```
## Test 
```sh
npm run test
```

To build and run the tests
```sh
npm run buildtest
```