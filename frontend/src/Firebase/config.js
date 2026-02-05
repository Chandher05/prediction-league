// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { API_BASE } from "../api/client";

import { useAuthState } from "react-firebase-hooks/auth";

// Your web app's Firebase configuration
// Firebase config now uses Vite environment variables
// Firebase config now uses Create React App environment variables
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY, // REACT_APP_FIREBASE_API_KEY
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN, // REACT_APP_FIREBASE_AUTH_DOMAIN
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID, // REACT_APP_FIREBASE_PROJECT_ID
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET, // REACT_APP_FIREBASE_STORAGE_BUCKET
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID, // REACT_APP_FIREBASE_MESSAGING_SENDER_ID
  appId: process.env.REACT_APP_FIREBASE_APP_ID, // REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const googleProvider = new GoogleAuthProvider();

const auth = getAuth(app);

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = await res.user;

    const userIdToken = await user.getIdToken();
    fetch(`${API_BASE}/users/login`, {
      headers: {
        Authorization: `Bearer ${userIdToken}`,
      },
      method: "POST",
    });
    return user;
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logout = (history) => {
  signOut(auth);
  history.push("/login");
};

// const getIdTokenOfUser = () => {
//   return getIdToken(auth);
// }

export { auth, useAuthState, signInWithGoogle, logout };
