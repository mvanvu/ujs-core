import { Arr } from '../../src';

it('Core Array', () => {
   // # Arr.sum<T>(source: T[], options?: { key?: string })
   // ## Calc sum of all number elements
   expect(Arr.sum([1, 2, 3])).toEqual(6);

   // ## The same but from an instance of Arr
   expect(Arr.from([1, 2, 3]).sum()).toEqual(6);

   // ## Calc sum of all elements by key-value pair, each element should be an object key-value pair
   expect(Arr.sum([{ foo: 1 }, { bar: 2 }, { foo: 3 }], { key: 'foo' })).toEqual(4);
   expect(Arr.sum([{ foo: 1 }, { bar: 2 }, { foo: 3 }], { key: 'bar' })).toEqual(2);

   // # Arr.avg<T>(source: T[], options?: { key?: string })
   // ## Calc average of all number elements
   expect(Arr.avg([1, 2, 3])).toEqual(2);

   // ## The same but from an instance of Arr, each element should be an object key-value pair
   expect(Arr.from([1, 2, 3]).avg()).toEqual(2);

   // ## Calc average of all elements by key-value pair, each element should be an object key-value pair
   expect(Arr.avg([{ foo: 1 }, { bar: 2 }, { foo: 3 }], { key: 'foo' })).toEqual(4 / 3);
   expect(Arr.avg([{ foo: 1 }, { bar: 2 }, { foo: 3 }], { key: 'bar' })).toEqual(2 / 3);

   // # Arr.min<T>(source: T[], options?: { key?: string })
   // ## Calc minimum of all number elements
   expect(Arr.min([1, 2, 3])).toEqual(1);

   // ## The same but from an instance of Arr
   expect(Arr.from([1, 2, 3]).min()).toEqual(1);

   // ## Calc minimum of all elements by key-value pair, each element should be an object key-value pair
   expect(Arr.min([{ foo: 1 }, { bar: 2 }, { foo: 3 }], { key: 'foo' })).toEqual({ foo: 1 });
   expect(Arr.min([{ foo: 1 }, { bar: 2 }, { foo: 3 }], { key: 'bar' })).toEqual({ bar: 2 });

   // # Arr.max<T>(source: T[], options?: { key?: string })
   // ## Calc maximum of all number elements
   expect(Arr.max([1, 2, 3])).toEqual(3);

   // ## The same but from an instance of Arr
   expect(Arr.from([1, 2, 3]).max()).toEqual(3);

   // ## Calc maximum of all elements by key-value pair, each element should be an object key-value pair
   expect(Arr.max([{ foo: 1 }, { bar: 2 }, { foo: 3 }], { key: 'foo' })).toEqual({ foo: 3 });
   expect(Arr.max([{ foo: 1 }, { bar: 2 }, { bar: 3 }], { key: 'bar' })).toEqual({ bar: 3 });

   // # Arr.intersect(a: any[], b: any[])
   // ## Found the intersect of two number arrays
   expect(Arr.intersect([2, 1], [2, 3])).toEqual([2]);
   expect(Arr.intersect([2, 1], [1, 2, 3])).toEqual([2, 1]);
   expect(Arr.intersect([2, 1, 4, 5], [1, 2, 3])).toEqual([2, 1]);

   // ## Find the intersect of two arrays by key-value pair
   expect(Arr.intersect([{ foo: 1 }, { bar: 2 }], [{ foo: '1' }, { bar: 2 }])).toEqual([{ bar: 2 }]);

   // # Arr.diff(a: any[], b: any[])
   // ## Find the difference of two arrays
   // ## 1 belongs to ARRAY 1 but not in ARRAY 2, 3 belongs to ARRAY 2 but not in ARRAY 1
   expect(Arr.diff([2, 1], [2, 3])).toEqual([1, 3]);

   // ## 3 belongs to ARRAY 2 but not in ARRAY 1
   expect(Arr.diff([2, 1], [1, 2, 3])).toEqual([3]);

   // ## 4 and 5 belong to ARRAY 1 but not in ARRAY 2, 3 belongs to ARRAY 2 but not in ARRAY 1
   expect(Arr.diff([2, 1, 4, 5], [1, 2, 3])).toEqual([4, 5, 3]);

   // ## Find the difference of two arrays by key-value pair
   expect(Arr.diff([{ foo: 1 }, { bar: 2 }], [{ foo: 1 }, { bar2: '2' }])).toEqual([{ bar: 2 }, { bar2: '2' }]);

   // # Step
   const arr = Arr.from([1, 2, 3]);

   // ## Move to the first element and return it
   expect(arr.first()).toEqual(1);

   // ## Move to the last element and return it
   expect(arr.last()).toEqual(3);

   // ## Reset the index=0 of the array and get the current index
   expect(arr.reset().current()).toEqual(1);

   // ## Next
   expect(arr.next()).toEqual(2);
   expect(arr.next()).toEqual(3);

   // ## Returns undefined because the step of array is overloaded
   expect(arr.next()).toEqual(undefined);

   // ## But the step isn't changed
   expect(arr.current()).toEqual(3);

   // ## Prev
   // ## The current step is the last of element
   expect(arr.prev()).toEqual(2);
   expect(arr.prev()).toEqual(1);

   // ## Returns undefined because the step of array is overloaded
   expect(arr.prev()).toEqual(undefined);

   // ## But the step isn't changed
   expect(arr.current()).toEqual(1);

   // ## Update the elements for the array
   expect(arr.update([4, 5, 6])).toEqual([4, 5, 6]);
   expect(arr.current()).toEqual(4);

   // # Arr.walk(index: number | 'first' | 'last' | 'prev' | 'next', callback: Function)
   // ## Walk to end of element and update its values
   arr.walk('last', (index: number) => (arr[index] *= 2));
   expect(arr.current()).toEqual(12);

   // # Arr.chunk<T>(array: T[], size = 1): Array<T[]>
   // ## Chunk the array by 1 size (defaults is 1)
   expect(Arr.chunk(['a', 'b', 'c', 'd'])).toEqual([['a'], ['b'], ['c'], ['d']]);

   // ## Chunk the array by n size
   expect(Arr.chunk(['a', 'b', 'c'], 2)).toEqual([['a', 'b'], ['c']]);
   expect(Arr.from(['a', 'b', 'c', 'd']).chunk(3)).toEqual([['a', 'b', 'c'], ['d']]);
   expect(Arr.from(['a', 'b', 'c', 'd']).chunk(4)).toEqual([['a', 'b', 'c', 'd']]);

   // # Symbol.iterator
   expect([...Arr.from([1, 2, 3])]).toEqual([1, 2, 3]);
});
