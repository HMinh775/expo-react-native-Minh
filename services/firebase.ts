import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
// Lấy config từ environment variables
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAtU6SOW_f9sZlj8dN0hRkwESIIJfPEb0U",
  authDomain: "movieticketapp-e1382.firebaseapp.com",
  projectId: "movieticketapp-e1382",
  storageBucket: "movieticketapp-e1382.firebasestorage.app",
  messagingSenderId: "1071517278238",
  appId: "1:1071517278238:web:dae37d66864e2f985a4e0f",
  measurementId: "G-SWWS12JHVC"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo Auth với AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Khởi tạo Firestore
const db = getFirestore(app);

export { app, auth, db };

