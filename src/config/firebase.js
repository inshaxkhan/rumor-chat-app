import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { getFirestore, setDoc } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD7C80EpwUbBezn-oAPKKbY-s00YgDYa8U",
  authDomain: "rumor-chat-app-23be1.firebaseapp.com",
  projectId: "rumor-chat-app-23be1",
  storageBucket: "rumor-chat-app-23be1.firebasestorage.app",
  messagingSenderId: "479441411396",
  appId: "1:479441411396:web:d0d94605295518a2a98b11"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db=getFirestore(app);

const signup = async (username,email,password) => {
    try {
        const res= await createUserWithEmailAndPassword(auth,email,password);
        const user=res.user;
        await setDoc(doc(db,"users",user.uid),{
            id:user.uid,
            username:username.toLowerCase(),
            email,
            name:"",
            avatar:"",
            bio:"How you doing?",
            lastSeen:Date.now()
        })
        await setDoc(doc(db,"chats",user.uid),{
            chatData:[]
        })
    } catch (error) {
         console.error(error)
    }
}
