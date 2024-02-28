## HASH

### Usage

```javascript
import { Hash, JWTErrorInvalid, DateTime } from '@maivubc/ujs';
```

### Sha256

```javascript
const secret = await Hash.sha256(JSON.stringify({ a: 'a', b: [1, 2, 3, 4], foo: { c: 'bar' } }));
secret; // It returns: '04aa106279f5977f59f9067fa9712afc4aedc6f5862a8defc34552d8c7206393'
```

### UUID

```javascript
const uuid: string[] = [];
let i = 1000;

while (i--) {
const uid = Hash.uuid();
uuid.includes(uid); // It returns: false
uuid.push(uid);
}

```

### Base64

```javascript
Hash.encodeBase64('Hello World!'); // It returns: 'SGVsbG8gV29ybGQh'
Hash.decodeBase64('SGVsbG8gV29ybGQh'); // It returns: 'Hello World!'
```

### Json Web Token

```javascript
const data = { sub: 123456, username: 'Im' };
const jwt = Hash.jwt();
const token = await jwt.sign(data, { iat: DateTime.now().add(30, 'second'), secret });

// Valid secret
await jwt.verify(token, { secret }); // It returns: data

// Wrong secret
const verify = async () => {
   try {
      await jwt.verify(token, { secret: Hash.uuid() });
   } catch (e) {
      return e;
   }
};

(await verify()) instanceof JWTErrorInvalid; // It returns: true
```
