## String

### Usage

```javascript
import { Str } from '@ujs/core';
```

### Common

```javascript
Str.toCamelCase('Hello world!'); // It returns: 'helloWorld'
Str.camelToSnackCase('helloWorld'); // It returns: 'hello_world'
Str.snackToCamelCase('hello_world'); // It returns: 'helloWorld'
Str.snackToCamelCase('hello__world'); // It returns: 'helloWorld'
Str.toCapitalize('hello__world'); // It returns: 'Hello__world'
Str.toCapitalize('hello! word#'); // It returns: 'Hello! Word#'

// Ignore none word = true
Str.toCapitalize('hello! word#', true); // It returns: 'HelloWord'
Str.toCapitalize('some123___testing string'); // It returns: 'Some123___testing String'
```

### Prototypes

```javascript
Str.from('HelloWorld').lFirst(); // It returns: 'helloWorld'
Str.from('helloWorld').uFirst(); // It returns: 'HelloWorld'
```

### Str.truncate(str: string, options?: { maxLength?: number; wordCount?: boolean; pad?: string })

```javascript
Str.truncate('hi-diddly-ho there, neighborino', { maxLength: 19 }); // It returns: 'hi-diddly-ho there,...'
Str.from('hi-diddly-ho there, neighborino').truncate({ maxLength: 19 }); // It returns: 'hi-diddly-ho there,...'

// Word count
Str.truncate('Hello world, Im new guy', { maxLength: 3, wordCount: true }); // It returns: 'Hello world, Im...'

// Custom three dots
Str.from('hi-diddly-ho there, neighborino').truncate({ maxLength: 19, pad: '$$$' }); // It returns: 'hi-diddly-ho there,$$$'
```

### Str.repeat(char: string, level = 0)

```javascript
Str.repeat('-', 0.4); // It returns: ''
Str.repeat('-', -1); // It returns: ''
Str.repeat('-', 0); // It returns: ''
Str.repeat('-', 1); // It returns: '-'
Str.repeat('-', 2); // It returns: '--'
Str.from('==').repeat(2); // It returns: '===='
```

### The string instance has the same the static method: toCamelCase, camelToSnackCase, snackToCamelCase, toCapitalize and truncate

```javascript
const str = Str.from('Hello world!');
str.toCamelCase(); // It returns: 'helloWorld'
str.truncate({ maxLength: 5, pad: '...$$' }); // It returns: 'Hello...$$'
```
