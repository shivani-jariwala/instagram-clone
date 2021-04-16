import firebase from 'firebase';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyB5EHS_qxa81K_-pDP3gW4OZEHkgbKN2xw",
    authDomain: "instagram-clone-react-518f0.firebaseapp.com",
    projectId: "instagram-clone-react-518f0",
    storageBucket: "instagram-clone-react-518f0.appspot.com",
    messagingSenderId: "1059968699612",
    appId: "1:1059968699612:web:20e6f60100803c4ee67819",
    measurementId: "G-7RPJBCBCY2"
  });

  const db= firebaseApp.firestore();
  const auth= firebase.auth();
  const storage= firebase.storage();

  export { db,auth,storage };