import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, doc, getDoc, getDocs, getFirestore, query, setDoc, where } from "firebase/firestore";
import { toast } from "react-toastify";

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
         console.error(error);
         toast.error(error.code.split('/')[1].split('-').join(" "));
         //  toast.error(error.message || "An error occurred during signup."); // improved error message
    }
}

const login = async(email,password)=>{
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.error(error);
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }
}

const logout = async ()=>{
    try {
        await signOut(auth);
    } catch (error) {
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }
}

const resetPass=async(email)=>{
    if(!email){
        toast.error("Enter your email!");
        return null;
    }

    try {
        const userRef=collection(db,'users');
        const q=query(userRef, where("email","==",email));
        const querySnap= await getDocs(q);

        if(!querySnap.empty){
            await sendPasswordResetEmail(auth,email);
            toast.success("Password Reset Email sent!");
        }
        else{
            toast.error("Email does not exist!")
        }
    } catch (error) {
        console.error(error);
        toast.error(error.message);
    }
}

export {signup, login, logout, auth, db, resetPass}
