import { Hash, JWTErrorInvalid, DateTime } from '../../src';

it('Core Hash', async () => {
   // # Hash.sha256(str: string): Promise<string>
   const secret = await Hash.sha256(JSON.stringify({ a: 'a', b: [1, 2, 3, 4], foo: { c: 'bar' } }));
   expect(secret).toEqual('04aa106279f5977f59f9067fa9712afc4aedc6f5862a8defc34552d8c7206393');

   // # Hash.uuid(): string -> UUID (v4)
   const uuid: string[] = [];
   let i = 1000;

   while (i--) {
      const uid = Hash.uuid();
      expect(uuid.includes(uid)).toBeFalsy();
      uuid.push(uid);
   }

   // # Hash.encodeBase64(str: string): string
   expect(Hash.encodeBase64('https://www.google.com/search?q=base64url')).toEqual('aHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS9zZWFyY2g/cT1iYXNlNjR1cmw=');

   // # Hash.decodeBase64(str: string): string
   expect(Hash.decodeBase64('aHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS9zZWFyY2g/cT1iYXNlNjR1cmw=')).toEqual('https://www.google.com/search?q=base64url');

   // # Hash.base64UrlEncode(str: string): string
   // ## Will replace '+' to '-', '/' to '_' and '=' to ''
   expect(Hash.base64UrlEncode('https://www.google.com/search?q=base64url')).toEqual('aHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS9zZWFyY2g_cT1iYXNlNjR1cmw');

   // # Hash.base64UrlDecode(str: string): string
   expect(Hash.base64UrlDecode('aHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS9zZWFyY2g_cT1iYXNlNjR1cmw')).toEqual('https://www.google.com/search?q=base64url');

   // # Hash.jwt(): JWT -> Json Web Token
   const jwt = Hash.jwt();
   const hashSecret = Hash.uuid();
   const data = { sub: 123456, username: 'Im' };
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
