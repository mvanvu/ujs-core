import { Hash, DateTime } from '../../src';

it('Core Hash', async () => {
   // Sha256
   const secret = await Hash.sha256(JSON.stringify({ a: 'a', b: [1, 2, 3, 4], foo: { c: 'bar' } }));
   expect(secret).toEqual('04aa106279f5977f59f9067fa9712afc4aedc6f5862a8defc34552d8c7206393');

   // UUID
   const uuid: string[] = [];
   let i = 1000;

   while (i--) {
      const uid = Hash.uuid();
      expect(uuid.includes(uid)).toBeFalsy();
      uuid.push(uid);
   }

   // Base64
   expect(Hash.encodeBase64('Hello World!')).toEqual('SGVsbG8gV29ybGQh');
   expect(Hash.decodeBase64('SGVsbG8gV29ybGQh')).toEqual('Hello World!');

   // JWT
   const data = { sub: 123456, username: 'Im' };
   const jwt = Hash.jwt();
   const token = await jwt.sign(data, { iat: DateTime.now().add(30, 'second'), secret });

   // -- Valid secret
   try {
      const decoded = await jwt.verify(token, { secret });
      expect(decoded).toEqual(data);
   } catch {
      expect(false).toBeTruthy();
   }

   // -- Wrong secret
   try {
      await jwt.verify(token, { secret: Hash.uuid() });
      expect(false).toBeTruthy();
   } catch {
      expect(false).toBeFalsy();
   }
});
