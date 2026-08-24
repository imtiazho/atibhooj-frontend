// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCNdV14I7NI3lqkkMI0liI6D5vbJYpmeE8",
  authDomain: "atibhooj-da254.firebaseapp.com",
  projectId: "atibhooj-da254",
  storageBucket: "atibhooj-da254.firebasestorage.app",
  messagingSenderId: "395867148386",
  appId: "1:395867148386:web:9463e3092d52a0a0dac13b",
  measurementId: "G-CLJFBMBGFS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);

export default auth;
