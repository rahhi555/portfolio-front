import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth ,connectAuthEmulator } from 'firebase/auth'
import { UserStore } from '~/store'

const firebaseConfig = {
  apiKey: 'AIzaSyDP38Ubcnjfzfg2IN4PTexqi21NJ8Kdwbo',
  authDomain: 'minimap-dadd2.firebaseapp.com',
  projectId: 'minimap-dadd2',
  storageBucket: 'minimap-dadd2.appspot.com',
  messagingSenderId: '251879137678',
  appId: '1:251879137678:web:1bb63f681e18329d8e04df',
  measurementId: 'G-YC8GZGYH1W',
}


const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
// window is not definedエラーが出るためprocess.clientにする
export const analytics = (process.env.NODE_ENV === 'production' && process.client) ? getAnalytics(app) : null

auth.onAuthStateChanged((user) => {
  if (!user || !user.email) return

  UserStore.setEmail(user.email)
})

if (process.env.NODE_ENV === 'development') {
  connectAuthEmulator(auth, 'http://localhost:9099')
}
