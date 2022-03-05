// Import the functions you need from the SDKs you need
import * as firebase from 'firebase';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAwmVJjyaNvoYQSkVYIPrAozhcn5bPe2kE",
  authDomain: "react-store-3f679.firebaseapp.com",
  projectId: "react-store-3f679",
  storageBucket: "react-store-3f679.appspot.com",
  messagingSenderId: "1019644317251",
  appId: "1:1019644317251:web:e04d7b1b48543fd9870ef6",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Export
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();