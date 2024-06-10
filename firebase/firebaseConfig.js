import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyArV66ls6JpwYWvKgL3XpOFfylYCO8twzA",
    authDomain: "swaphub-3cf6b.firebaseapp.com",
    projectId: "swaphub-3cf6b",
    storageBucket: "swaphub-3cf6b.appspot.com",
    messagingSenderId: "700387253442",
    appId: "1:700387253442:web:b3af3fe869a79d6fdeaf5b",
    measurementId: "G-VXE2RBXKTG"
}
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)

}
export {firebase}



