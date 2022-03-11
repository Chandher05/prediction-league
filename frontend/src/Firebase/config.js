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

import { useAuthState } from 'react-firebase-hooks/auth';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_FIREBASE,
  authDomain: process.env.REACT_APP_API_FIREBASE_PROJECT_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_API_FIREBASE,
  appId: process.env.REACT_APP_API_FIREBASE_PROJECT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const googleProvider = new GoogleAuthProvider();

const auth = getAuth(app);

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    await user.getIdToken().then(function (idToken) {  // <------ Check this line
      fetch(`${process.env.REACT_APP_API}/users/login`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
        method: 'POST',
      })
    });
    return user;
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logout = () => {
  signOut(auth);
};

// const getIdTokenOfUser = () => {
//   return getIdToken(auth);
// }



export {
  auth,
  useAuthState,
  signInWithGoogle,
  logout,
};