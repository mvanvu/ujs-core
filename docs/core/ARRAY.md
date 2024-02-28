## ARRAY

### Usage

```javascript
import { Arr } from '@maivubc/ujs';
```

### Sum

```javascript
// Calc sum of all number elements
Arr.sum([1, 2, 3]); // It returns: 6

// The same but from an instance of Arr
Arr.from([1, 2, 3]).sum(); // It returns: 6

// Calc sum of all elements by key-value pair, each element should be an object
Arr.sum([{ foo: 1 }, { bar: 2 }, { foo: 3 }], { key: 'foo' }); // It returns: 4
Arr.sum([{ foo: 1 }, { bar: 2 }, { foo: 3 }], { key: 'bar' }); // It returns: 2
```

### Avg

```javascript
// Calc average of all number elements
Arr.avg([1, 2, 3]); // It returns: 2

// The same but from an instance of Arr
Arr.from([1, 2, 3]).avg(); // It returns: 2

// Calc average of all elements by key-value pair, each element should be an object
Arr.avg([{ foo: 1 }, { bar: 2 }, { foo: 3 }], { key: 'foo' }); // It returns: 4 / 3
Arr.avg([{ foo: 1 }, { bar: 2 }, { foo: 3 }], { key: 'bar' }); // It returns: 2 / 3
```

### Min

```javascript
// Calc minimum of all number elements
Arr.min([1, 2, 3]); // It returns: 1

// The same but from an instance of Arr
Arr.from([1, 2, 3]).min(); // It returns: 1

// Calc minimum of all elements by key-value pair, each element should be an object
Arr.min([{ foo: 1 }, { bar: 2 }, { foo: 3 }], { key: 'foo' }); // It returns: { foo: 1 }
Arr.min([{ foo: 1 }, { bar: 2 }, { foo: 3 }], { key: 'bar' }); // It returns: { bar: 2 }
```

### Max

```javascript
// Calc maximum of all number elements
Arr.max([1, 2, 3]); // It returns: 3

// The same but from an instance of Arr
Arr.from([1, 2, 3]).max(); // It returns: 3

// Calc maximum of all elements by key-value pair, each element should be an object
Arr.max([{ foo: 1 }, { bar: 2 }, { foo: 3 }], { key: 'foo' }); // It returns: { foo: 3 }
Arr.max([{ foo: 1 }, { bar: 2 }, { foo: 3 }], { key: 'bar' }); // It returns: { bar: 2 }
```

### Intersect

```javascript
// Found the intersect of two number arrays
Arr.intersect([2, 1], [2, 3]); // It returns: [2]
Arr.intersect([2, 1], [1, 2, 3]); // It returns: [2, 1]
Arr.intersect([2, 1, 4, 5], [1, 2, 3]); // It returns: [2, 1]

// Find the intersect of two arrays by key-value pair, each element should be an object
Arr.intersect([{ foo: 1 }, { bar: 2 }], [{ foo: '1' }, { bar: 2 }]); // It returns: [{ bar: 2 }]
```

### Diff

```javascript
// Find the difference of two arrays
Arr.diff([2, 1], [2, 3]); // It returns: [1, 3]
Arr.diff([2, 1], [1, 2, 3]); // It returns: [3]
Arr.diff([2, 1, 4, 5], [1, 2, 3]); // It returns: [4, 5, 3]

// Find the difference of two arrays by key-value pair, each element should be an object
Arr.diff([{ foo: 1 }, { bar: 2 }], [{ foo: 1 }, { bar2: '2' }]); // It returns: [{ bar: 2 }, { bar2: '2' }]
```

### Step

```javascript
const arr = Arr.from([1, 2, 3]);

// Move to the first element and return it
arr.first(); // It returns: 1

// Move to the last element and return it
arr.last(); // It returns: 3

// Reset the index=0 of the array and get the current index
arr.reset().current(); // It returns: 1

// Move the index to next and return the current element
arr.next(); // It returns: 2
arr.next(); // It returns: 3
arr.next(); // It returns: undefined

// Create an empty array and move the index to the last element and return it
Arr.from([]).last(); // It returns: undefined

// Update the elements for the array
arr.update([4, 5, 6]); // It returns: [4, 5, 6]
```

### Walking

```javascript
// Walk to end element and update it
arr.walk('last', (index: number) => (arr[index] *= 2));
arr.current(); // It returns: 12

```

### Chunk

```javascript
// Chunk the array by 1 len (defaults is 1)
Arr.chunk(['a', 'b', 'c', 'd']); // It returns: [['a'], ['b'], ['c'], ['d']]
Arr.from(['a', 'b', 'c', 'd']).chunk(); // It returns: [['a'], ['b'], ['c'], ['d']]

// Chunk the array by n len
Arr.chunk(['a', 'b', 'c'], 2); // It returns: [['a', 'b'], ['c']]
Arr.chunk(['a', 'b', 'c', 'd'], 3); // It returns: [['a', 'b', 'c'], ['d']]
Arr.from(['a', 'b', 'c', 'd']).chunk(3); // It returns: [['a', 'b', 'c'], ['d']]
```

### Symbol.iterator

```javascript
[...Arr.from([1, 2, 3])]; // It returns: [1, 2, 3]
```
