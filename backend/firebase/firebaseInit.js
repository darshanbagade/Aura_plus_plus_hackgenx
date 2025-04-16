import admin, { apps, initializeApp, credential as _credential } from 'firebase-admin';
import serviceAccount from '../config/firebaseServiceAccountKey.json';

if (!apps.length) {
  initializeApp({
    credential: _credential.cert(serviceAccount),
  });
}

export default admin;
