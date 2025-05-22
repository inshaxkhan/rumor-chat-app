import React, { useContext, useState } from "react";
import "./LeftSidebar.css";
import assets from "./../../assets/assets.js";
import { useNavigate } from "react-router-dom";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../config/firebase.js";
import { AppContext } from "../../context/AppContext.jsx";
import { toast } from "react-toastify";
import Loader from "../Loader.jsx";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { userData, chatData, chatUser, setChatUser, messagesId, setMessagesId } = useContext(AppContext);
  const [user, setUser] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  const inputHandler = async (e) => {
    try {
      const input = e.target.value;
      if (input) {
        setShowSearch(true);
        const userRef = collection(db, "users");
        const q = query(userRef, where("username", "==", input.toLowerCase()));
        const querySnap = await getDocs(q);
        if (!querySnap.empty && querySnap.docs[0].data().id !== userData.id) {
          let userExist=false;
          chatData.map((user)=>{
            if(user.rId===querySnap.docs[0].data().id){
              userExist=true;
            }
          })
          if(!userExist){
            setUser(querySnap.docs[0].data());
          }
        } else {
          setUser(null);
        }
      } else {
        setShowSearch(false);
      }
    } catch (error) {}
  };

  const addChat = async () => {
    const messagesRef = collection(db, "messages");
    const chatsRef = collection(db, "chats");

    try {
      const newMessageRef = doc(messagesRef);
      await setDoc(newMessageRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      // Add to recipient chat
      await updateDoc(doc(chatsRef, user.id), {
        chatData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: userData.id,
          updatedAt: Date.now(),
          messageSeen: true,
        })
      });

      // Add to current user chat
      await updateDoc(doc(chatsRef, userData.id), {
        chatData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: user.id,
          updatedAt: Date.now(),
          messageSeen: true,
        }),
      });

    } catch (error) {
      toast.error("Failed to add chat: " + error.message);
      console.error("addChat error:", error);
    }
  };

  const setChat=async(item)=>{
    setMessagesId(item.messageId);
    setChatUser(item);
  }

  return (
    <div className="ls">
      <div className="ls-top">
        <div className="ls-nav">
          <img src={assets.logo_rev} alt="Logo" className="logo" />
          <div className="menu">
            <img src={assets.menu_icon} alt="Menu Icon" />
            <div className="sub-menu">
              <p onClick={() => navigate("/profile")}>Edit Profile</p>
              <hr />
              <p>Logout</p>
            </div>
          </div>
        </div>

        <div className="ls-search">
          <img src={assets.search_icon} alt="Search Icon" />
          <input
            onChange={inputHandler}
            type="text"
            placeholder="Search here..."
            className="w-40 px-5 outline-0"
          />
        </div>
      </div>

      <div className="ls-list">
        {showSearch && user ? 
          <div onClick={addChat} className="friends add-user">
            <img src={user.avatar} alt="" />
            <div>
              <p>{user.name}</p>
              <span>{user.lastMessage}</span>
            </div>
          </div>
         : chatData.map((item, index) => (
            <div onClick={()=>{setChat(item)}} key={index} className="friends">
              <img src={item.userData.avatar} alt="" />
              <div>
                <p>{item.userData.name}</p>
                <span>{item.lastMessage}</span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default LeftSidebar;
