import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/analytics'
import { UserStore } from '~/store'

const firebaseConfig = {
  apiKey: "AIzaSyDP38Ubcnjfzfg2IN4PTexqi21NJ8Kdwbo",
  authDomain: "minimap-dadd2.firebaseapp.com",
  projectId: "minimap-dadd2",
  storageBucket: "minimap-dadd2.appspot.com",
  messagingSenderId: "251879137678",
  appId: "1:251879137678:web:1bb63f681e18329d8e04df",
  measurementId: "G-YC8GZGYH1W"
};

if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig)
}

if (process.env.NODE_ENV !== "production") {
  const auth = firebase.auth()
  // @ts-ignore
  auth.useEmulator('http://localhost:9099', { disableWarnings: true })
}

if (process.env.NODE_ENV === "production") {
  firebase.analytics()
}

firebase.auth().onAuthStateChanged((user) => {
  if (!user || !user.email) return
  UserStore.setEmail(user.email)
})



export default firebase