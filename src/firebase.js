// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getFunctions, httpsCallable, connectFunctionsEmulator } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-functions.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-storage.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBsegECd9H2XFVU_39XO7aQF61joAmaOMk",
  authDomain: "alphahive-3fb9c.firebaseapp.com",
  projectId: "alphahive-3fb9c",
  storageBucket: "alphahive-3fb9c.firebasestorage.app",
  messagingSenderId: "631455636240",
  appId: "1:631455636240:web:91fe5a588cc36c5fe46395",
  measurementId: "G-9F4BML11QW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); 
export const functions = getFunctions(app);

if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
  console.log("🛠️ Using Local Functions Emulator");
  connectFunctionsEmulator(functions, "127.0.0.1", 5001);
}

export { httpsCallable };
export default app;