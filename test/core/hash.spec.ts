import { Hash, JWTErrorInvalid, DateTime } from '../../src';

it('Core Hash', async () => {
   // # Sha256
   const secret = await Hash.sha256(JSON.stringify({ a: 'a', b: [1, 2, 3, 4], foo: { c: 'bar' } }));
   expect(secret).toEqual('04aa106279f5977f59f9067fa9712afc4aedc6f5862a8defc34552d8c7206393');

   // # UUID (v4)
   const uuid: string[] = [];
   let i = 1000;

   while (i--) {
      const uid = Hash.uuid();
      expect(uuid.includes(uid)).toBeFalsy();
      uuid.push(uid);
   }

   // # Base64
   expect(Hash.encodeBase64('https://www.google.com/search?q=base64url')).toEqual('aHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS9zZWFyY2g/cT1iYXNlNjR1cmw=');
   expect(Hash.decodeBase64('aHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS9zZWFyY2g/cT1iYXNlNjR1cmw=')).toEqual('https://www.google.com/search?q=base64url');

   // # Base64Url
   // ## Will replace '+' to '-', '/' to '_' and '=' to ''
   expect(Hash.base64UrlEncode('https://www.google.com/search?q=base64url')).toEqual('aHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS9zZWFyY2g_cT1iYXNlNjR1cmw');

   // ## Decode to the original string
   expect(Hash.base64UrlDecode('aHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS9zZWFyY2g_cT1iYXNlNjR1cmw')).toEqual('https://www.google.com/search?q=base64url');

   // # Json Web Token
   const hashSecret = Hash.uuid();
   const data = { sub: 123456, username: 'Im' };
   const jwt = Hash.jwt();
   const token = await jwt.sign(data, { iat: DateTime.now().add(30, 'second'), secret: hashSecret });

   // ## Valid secret
   expect(await jwt.verify(token, { secret: hashSecret })).toEqual(data);

   // ## Wrong secret
   const verify = async () => {
      try {
         await jwt.verify(token, { secret: Hash.uuid() });
      } catch (e) {
         return e;
      }
   };

   expect((await verify()) instanceof JWTErrorInvalid).toBeTruthy();
});
