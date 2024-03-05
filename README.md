# UJS (TypeScript)

UMD JS work on the both Browser and NodeJs

## Install

```
// With yarn
yarn add @ujs/core

// With NPM
npm install @ujs/core
```

### Usage On Browser

```
<script src="dist/index.js">
    const { DateTime } = window.$ujs;
    console.log(DateTime.now());
</script>
```

### Usage On NodeJS

```
import { DateTime } from '@ujs/core';
console.log(DateTime.now());
```

### Test

```
// Test all utils
yarn test

// Test for a util
yarn test datetime
```

See all the sample tests at: /test/lib

### API Documentation

-  [Array](docs/Array.md) an advanced of the JS native Array
-  [DateTime](docs/Datetime.md) an advanced of the JS native Date
-  [Hash](docs/Hash.md) provide some useful methods such as: base64, sha256, uuid, JWT...
-  [Is](docs/Is.md) validate the value that will (or will not) match some conditions
-  [Object](docs/Object.md) provide some useful static and instance methods for the Object
-  [Registry](docs/Registry.md) powerful object key-value pair manager
-  [String](docs/String.md) an advanced of the JS native String
-  [Transform](docs/Transform.md) provide the transformer to convert any value to some expected value
-  [Util](docs/Util.md) provide some useful common util methods
