import { Hash } from '../../src';

it('Util Hash', async () => {
   // Sha 256
   const str = await Hash.sha256(JSON.stringify({ a: 'a', b: [1, 2, 3, 4], foo: { c: 'bar' } }));
   expect(str).toEqual('04aa106279f5977f59f9067fa9712afc4aedc6f5862a8defc34552d8c7206393');

   // UUID
   const uuid: string[] = [];
   let i = 1000;

   while (i--) {
      const uid = Hash.uuid();
      expect(uuid.includes(uid)).toBeFalsy();
      uuid.push(uid);
   }
});
