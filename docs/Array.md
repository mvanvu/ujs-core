## Array

### Usage

```javascript
import { Arr } from '@ujs/core';
```

### Arr.sum<T>(source: T[], options?: { key?: string })

```javascript
// Calc sum of all number elements
Arr.sum([1, 2, 3]); // It returns: 6

// The same but from an instance of Arr
Arr.from([1, 2, 3]).sum(); // It returns: 6

// Calc sum of all elements by key-value pair, each element should be an object key-value pair
Arr.sum([{ foo: 1 }, { bar: 2 }, { foo: 3 }], { key: 'foo' }); // It returns: 4
Arr.sum([{ foo: 1 }, { bar: 2 }, { foo: 3 }], { key: 'bar' }); // It returns: 2
```

### Arr.avg<T>(source: T[], options?: { key?: string })

```javascript
// Calc average of all number elements
Arr.avg([1, 2, 3]); // It returns: 2

// The same but from an instance of Arr, each element should be an object key-value pair
Arr.from([1, 2, 3]).avg(); // It returns: 2

// Calc average of all elements by key-value pair, each element should be an object key-value pair
Arr.avg([{ foo: 1 }, { bar: 2 }, { foo: 3 }], { key: 'foo' }); // It returns: 4 / 3
Arr.avg([{ foo: 1 }, { bar: 2 }, { foo: 3 }], { key: 'bar' }); // It returns: 2 / 3
```

### Arr.min<T>(source: T[], options?: { key?: string })

```javascript
// Calc minimum of all number elements
Arr.min([1, 2, 3]); // It returns: 1

// The same but from an instance of Arr
Arr.from([1, 2, 3]).min(); // It returns: 1

// Calc minimum of all elements by key-value pair, each element should be an object key-value pair
Arr.min([{ foo: 1 }, { bar: 2 }, { foo: 3 }], { key: 'foo' }); // It returns: { foo: 1 }
Arr.min([{ foo: 1 }, { bar: 2 }, { foo: 3 }], { key: 'bar' }); // It returns: { bar: 2 }
```

### Arr.max<T>(source: T[], options?: { key?: string })

```javascript
// Calc maximum of all number elements
Arr.max([1, 2, 3]); // It returns: 3

// The same but from an instance of Arr
Arr.from([1, 2, 3]).max(); // It returns: 3

// Calc maximum of all elements by key-value pair, each element should be an object key-value pair
Arr.max([{ foo: 1 }, { bar: 2 }, { foo: 3 }], { key: 'foo' }); // It returns: { foo: 3 }
Arr.max([{ foo: 1 }, { bar: 2 }, { bar: 3 }], { key: 'bar' }); // It returns: { bar: 3 }
```

### Arr.intersect(a: any[], b: any[])

```javascript
// Found the intersect of two number arrays
Arr.intersect([2, 1], [2, 3]); // It returns: [2]
Arr.intersect([2, 1], [1, 2, 3]); // It returns: [2, 1]
Arr.intersect([2, 1, 4, 5], [1, 2, 3]); // It returns: [2, 1]

// Find the intersect of two arrays by key-value pair
Arr.intersect([{ foo: 1 }, { bar: 2 }], [{ foo: '1' }, { bar: 2 }]); // It returns: [{ bar: 2 }]
```

### Arr.diff(a: any[], b: any[])

```javascript
// Find the difference of two arrays

// 1 belongs to ARRAY 1 but not in ARRAY 2, 3 belongs to ARRAY 2 but not in ARRAY 1
Arr.diff([2, 1], [2, 3]); // It returns: [1, 3]

// 3 belongs to ARRAY 2 but not in ARRAY 1
Arr.diff([2, 1], [1, 2, 3]); // It returns: [3]

// 4 and 5 belong to ARRAY 1 but not in ARRAY 2, 3 belongs to ARRAY 2 but not in ARRAY 1
Arr.diff([2, 1, 4, 5], [1, 2, 3]); // It returns: [4, 5, 3]

// Find the difference of two arrays by key-value pair
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

// Next
arr.next(); // It returns: 2
arr.next(); // It returns: 3

// Returns undefined because the step of array is overloaded
arr.next(); // It returns: undefined

// But the step isn't changed
arr.current(); // It returns: 3

// Prev

// The current step is the last of element
arr.prev(); // It returns: 2
arr.prev(); // It returns: 1

// Returns undefined because the step of array is overloaded
arr.prev(); // It returns: undefined

// But the step isn't changed
arr.current(); // It returns: 1

// Update the elements for the array
arr.update([4, 5, 6]); // It returns: [4, 5, 6]
arr.current(); // It returns: 4
```

### Arr.walk(index: number | 'first' | 'last' | 'prev' | 'next', callback: Function)

```javascript
// Walk to end of element and update its values
arr.walk('last', (index: number) => (arr[index] *= 2));
arr.current(); // It returns: 12

```

### Arr.chunk<T>(array: T[], size = 1): Array<T[]>

```javascript
// Chunk the array by 1 size (defaults is 1)
Arr.chunk(['a', 'b', 'c', 'd']); // It returns: [['a'], ['b'], ['c'], ['d']]

// Chunk the array by n size
Arr.chunk(['a', 'b', 'c'], 2); // It returns: [['a', 'b'], ['c']]
Arr.from(['a', 'b', 'c', 'd']).chunk(3); // It returns: [['a', 'b', 'c'], ['d']]
Arr.from(['a', 'b', 'c', 'd']).chunk(4); // It returns: [['a', 'b', 'c', 'd']]
```

### Symbol.iterator

```javascript
[...Arr.from([1, 2, 3])]; // It returns: [1, 2, 3]
```
