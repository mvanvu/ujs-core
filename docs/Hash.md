## Hash

### Usage

```javascript
import { Hash, JWTErrorInvalid, DateTime } from '@ujs/core';
```

### Hash.sha256(str: string): Promise<string>

```javascript
const secret = await Hash.sha256(JSON.stringify({ a: 'a', b: [1, 2, 3, 4], foo: { c: 'bar' } }));
secret; // It returns: '04aa106279f5977f59f9067fa9712afc4aedc6f5862a8defc34552d8c7206393'
```

### Hash.uuid() -> UUID (v4)

```javascript
const uuid: string[] = [];
let i = 1000;

while (i--) {
const uid = Hash.uuid();
uuid.includes(uid); // It returns: false
uuid.push(uid);
}

```

### Hash.encodeBase64(str: string)

```javascript
Hash.encodeBase64('https://www.google.com/search?q=base64url'); // It returns: 'aHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS9zZWFyY2g/cT1iYXNlNjR1cmw='
```

### Hash.decodeBase64(str: string)

```javascript
Hash.decodeBase64('aHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS9zZWFyY2g/cT1iYXNlNjR1cmw='); // It returns: 'https://www.google.com/search?q=base64url'
```

### Hash.base64UrlEncode(str: string)

```javascript
// Will replace '+' to '-', '/' to '_' and '=' to ''
Hash.base64UrlEncode('https://www.google.com/search?q=base64url'); // It returns: 'aHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS9zZWFyY2g_cT1iYXNlNjR1cmw'
```

### Hash.base64UrlDecode(str: string)

```javascript
Hash.base64UrlDecode('aHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS9zZWFyY2g_cT1iYXNlNjR1cmw'); // It returns: 'https://www.google.com/search?q=base64url'
```

### Hash.jwt() -> Json Web Token

```javascript
const jwt = Hash.jwt();
const hashSecret = Hash.uuid();
const data = { sub: 123456, username: 'Im' };
const token = await jwt.sign(data, { iat: DateTime.now().add(30, 'second'), secret: hashSecret });

// Valid secret
await jwt.verify(token, { secret: hashSecret }); // It returns: data

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
