// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAFpGa4pJyUQa__OpWQ5vasP9xIMLADFSA",
  authDomain: "livemart-97ec2.firebaseapp.com",
  projectId: "livemart-97ec2",
  storageBucket: "livemart-97ec2.firebasestorage.app",
  messagingSenderId: "367550349132",
  appId: "1:367550349132:web:9307ff6fd443a975db99e9",
  measurementId: "G-09RV5632VQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Optional: Configure Google provider if needed
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export { auth, googleProvider, analytics };
export default app;