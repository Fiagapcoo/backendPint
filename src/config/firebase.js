// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD8fzhAXSKnKrJQouSqAka3CZUMRI7-YVY",
  authDomain: "softshares-000515.firebaseapp.com",
  projectId: "softshares-000515",
  storageBucket: "softshares-000515.appspot.com",
  messagingSenderId: "602316436569",
  appId: "1:602316436569:web:e55bcb45779a1b712aad48",
  measurementId: "G-T2LD78DFC9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);