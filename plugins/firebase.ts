import firebase from 'firebase/app'
import 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyDP38Ubcnjfzfg2IN4PTexqi21NJ8Kdwbo",
  authDomain: "minimap-dadd2.firebaseapp.com",
  projectId: "minimap-dadd2",
  storageBucket: "minimap-dadd2.appspot.com",
  messagingSenderId: "251879137678",
  appId: "1:251879137678:web:1bb63f681e18329d8e04df"
};

if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig)
}

export default firebase