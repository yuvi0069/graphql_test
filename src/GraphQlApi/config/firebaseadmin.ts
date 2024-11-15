// firebaseAdmin.js
import admin from 'firebase-admin';

import * as dotenv from 'dotenv';

dotenv.config();

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT as string);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "rent-payment-backend.appspot.com" 
});

const bucket = admin.storage().bucket();

export { admin, bucket };
