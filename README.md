# avola-client : NPM Version
Avola Decision client to execute and synchronize your decisions
inspiration: https://codeburst.io/https-chidume-nnamdi-com-npm-module-in-typescript-12b3b22f0724
## Installation 
```sh
npm install avola-client --save
yarn add mypluralize
bower install pluralize --save
```
## Usage
### Javascript
```javascript
var pluralise = require('mypluralize');
var boys = pluralise.getPlural('Boy');
```
```sh
Output should be 'Boys'
```
### TypeScript
```typescript
import { getPlural } from 'mypluralize';
console.log(getPlural('Goose'))
```
```sh
Output should be 'Geese'
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