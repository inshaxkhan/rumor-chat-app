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
  const { userData, chatData } = useContext(AppContext);
  const [user, setUser] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  const inputHandler = async (e) => {
    try {
      const input = e.target.value.trim().toLowerCase();
      if (input) {
        setShowSearch(true);
        const userRef = collection(db, "users");
        const q = query(
          userRef,
          where("username", ">=", input),
          where("username", "<=", input + "\uf8ff")
        );
        const querySnap = await getDocs(q);

        if (!querySnap.empty) {
          const foundUser = querySnap.docs[0].data();
          if (foundUser.id !== userData.id) {
            let userExist = false;

            if (Array.isArray(chatData)) {
              chatData.forEach((chat) => {
                if (chat.rId === foundUser.id) {
                  userExist = true;
                }
              });
            }

            if (!userExist) {
              setUser(foundUser);
            } else {
              setUser(null);
            }
          } else {
            setUser(null); // if same user is searched
          }
        } else {
          setUser(null);
        }
      } else {
        setShowSearch(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Search error:", error.message);
    }
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
          rName: userData.name,
          rAvatar: userData.avatar,
          updatedAt: Date.now(),
          messageSeen: true,
        }),
      });

      // Add to current user chat
      await updateDoc(doc(chatsRef, userData.id), {
        chatData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: user.id,
          rName: user.name,
          rAvatar: user.avatar,
          updatedAt: Date.now(),
          messageSeen: true,
        }),
      });

      setShowSearch(false);
      setUser(null);
    } catch (error) {
      toast.error("Failed to add chat: " + error.message);
      console.error("addChat error:", error);
    }
  };

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
        {showSearch && user ? (
          <div onClick={addChat} className="friends add-user cursor-pointer">
            <img src={user.avatar} alt={user.name} />
            <p>{user.name}</p>
          </div>
        ): Array.isArray(chatData) ? (
          chatData.map((item, index) => (
            <div key={index} className="friends">
              <img src={item.userData.avatar} alt="" />
              <div>
                <p>{item.userData.name}</p>
                <span>{item.lastMessage  || "last message"}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center gap-4">
            <Loader/>
            <Loader/>
            <Loader/>
            <Loader/>
            <Loader/>
            <Loader/>
            <Loader/>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeftSidebar;