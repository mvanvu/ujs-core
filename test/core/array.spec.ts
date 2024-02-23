import { Arr } from '../../src';

it('Core Array', () => {
   // Sum
   expect(Arr.sum([1, 2, 3])).toEqual(6);
   expect(Arr.from([1, 2, 3]).sum()).toEqual(6);
   expect(Arr.sum([{ foo: 1 }, { bar: 2 }, { foo: 3 }], { key: 'foo' })).toEqual(4);
   expect(Arr.sum([{ foo: 1 }, { bar: 2 }, { foo: 3 }], { key: 'bar' })).toEqual(2);

   // Avg
   expect(Arr.avg([1, 2, 3])).toEqual(2);
   expect(Arr.from([1, 2, 3]).avg()).toEqual(2);
   expect(Arr.avg([{ foo: 1 }, { bar: 2 }, { foo: 3 }], { key: 'foo' })).toEqual(4 / 3);
   expect(Arr.avg([{ foo: 1 }, { bar: 2 }, { foo: 3 }], { key: 'bar' })).toEqual(2 / 3);

   // Min
   expect(Arr.min([1, 2, 3])).toEqual(1);
   expect(Arr.from([1, 2, 3]).min()).toEqual(1);
   expect(Arr.min([{ foo: 1 }, { bar: 2 }, { foo: 3 }], { key: 'foo' })).toEqual({ foo: 1 });
   expect(Arr.min([{ foo: 1 }, { bar: 2 }, { foo: 3 }], { key: 'bar' })).toEqual({ bar: 2 });

   // Max
   expect(Arr.max([1, 2, 3])).toEqual(3);
   expect(Arr.from([1, 2, 3]).max()).toEqual(3);
   expect(Arr.max([{ foo: 1 }, { bar: 2 }, { foo: 3 }], { key: 'foo' })).toEqual({ foo: 3 });
   expect(Arr.max([{ foo: 1 }, { bar: 2 }, { foo: 3 }], { key: 'bar' })).toEqual({ bar: 2 });

   // Intersect
   expect(Arr.intersect([2, 1], [2, 3])).toEqual([2]);
   expect(Arr.intersect([2, 1], [1, 2, 3])).toEqual([2, 1]);
   expect(Arr.intersect([2, 1, 4, 5], [1, 2, 3])).toEqual([2, 1]);
   expect(Arr.intersect([{ foo: 1 }, { bar: 2 }], [{ foo: '1' }, { bar: 2 }])).toEqual([{ bar: 2 }]);

   // Diff
   expect(Arr.diff([2, 1], [2, 3])).toEqual([1, 3]);
   expect(Arr.diff([2, 1], [1, 2, 3])).toEqual([3]);
   expect(Arr.diff([2, 1, 4, 5], [1, 2, 3])).toEqual([4, 5, 3]);
   expect(Arr.diff([{ foo: 1 }, { bar: 2 }], [{ foo: 1 }, { bar2: '2' }])).toEqual([{ bar: 2 }, { bar2: '2' }]);

   // Step
   const arr = Arr.from([1, 2, 3]);
   expect(arr.first()).toEqual(1);
   expect(arr.first()).toEqual(1);
   expect(arr.last()).toEqual(3);
   expect(arr.reset().current()).toEqual(1);
   expect(arr.next()).toEqual(2);
   expect(arr.next()).toEqual(3);
   expect(arr.next()).toEqual(undefined);
   expect(Arr.from([]).last()).toEqual(undefined);

   // Update
   expect(arr.update([4, 5, 6])).toEqual([4, 5, 6]);

   // Chunk
   expect(Arr.chunk(['a', 'b', 'c', 'd'])).toEqual([['a'], ['b'], ['c'], ['d']]);
   expect(Arr.from(['a', 'b', 'c', 'd']).chunk()).toEqual([['a'], ['b'], ['c'], ['d']]);
   expect(Arr.chunk(['a', 'b', 'c', 'd'], 2)).toEqual([
      ['a', 'b'],
      ['c', 'd'],
   ]);
   expect(Arr.chunk(['a', 'b', 'c', 'd'], 3)).toEqual([['a', 'b', 'c'], ['d']]);
   expect(Arr.from(['a', 'b', 'c', 'd']).chunk(3)).toEqual([['a', 'b', 'c'], ['d']]);

   // Symbol.iterator
   expect([...Arr.from([1, 2, 3])]).toEqual([1, 2, 3]);
});
