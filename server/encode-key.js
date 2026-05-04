require('dotenv').config();
const key = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
console.log(Buffer.from(key).toString('base64'));
