import admin from 'firebase-admin';
import { readFile } from 'fs/promises';

// Read the JSON file manually
const serviceAccount = JSON.parse(
  await readFile(
    new URL('./firebaseServiceAccountKey.json', import.meta.url)
  )
);

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

export default admin;
export { db };