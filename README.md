# Util JS

UMD JS work on the both Browser and NodeJs

## Install

```
// With yarn
yarn add @mvanvu/ujs

// With NPM
npm install @mvanvu/ujs
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
import { DateTime } from '@mvanvu/ujs';
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

-  [DateTime](docs/Datetime.md) an advanced of the JS native Date
-  [EventEmitter](docs/Event-emitter.md) an event emitter
-  [Hash](docs/Hash.md) provide some useful methods such as: base64, sha256, uuid, JWT...
-  [Is](docs/Is.md) validate the value that will (or will not) match some conditions
-  [Registry](docs/Registry.md) powerful object key-value pair manager
-  [Schema](docs/Schema.md) validate the value by using Schema
-  [Transform](docs/Transform.md) provide the transformer to convert any value to some expected value
-  [Util](docs/Util.md) provide some useful common util methods
