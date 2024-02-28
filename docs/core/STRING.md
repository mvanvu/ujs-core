## STRING

### Usage

```javascript
import { Str } from '@maivubc/ujs';
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

### Truncate

```javascript
Str.truncate('hi-diddly-ho there, neighborino', 19); // It returns: 'hi-diddly-ho there,...'
Str.from('hi-diddly-ho there, neighborino').truncate(19); // It returns: 'hi-diddly-ho there,...'
```

### Repeat

```javascript
Str.repeat('-', 0.4); // It returns: ''
Str.repeat('-', -1); // It returns: ''
Str.repeat('-', 0); // It returns: ''
Str.repeat('-', 1); // It returns: '-'
Str.repeat('-', 2); // It returns: '--'
Str.from('==').repeat(2); // It returns: '===='
```
