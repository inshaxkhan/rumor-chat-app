import React, { useContext, useEffect, useState } from "react";
import "./ChatBox.css";
import "./../../assets/assets.js";
import assets from "./../../assets/assets.js";
import { AppContext } from "../../context/AppContext.jsx";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../config/firebase.js";
import upload from "../../lib/upload.js";

const ChatBox = () => {
  const { userData, messagesId, chatUser, messages, setMessages } =
    useContext(AppContext);

  const [input, setInput] = useState("");
  const sendMessage = async () => {
    try {
      if (input && messagesId) {
        await updateDoc(doc(db, "messages", messagesId), {
          messages: arrayUnion({
            sId: userData.id,
            text: input,
            createdAt: new Date(),
          }),
        });

        const userIds = [chatUser.rId, userData.id];

        // update last seen
        userIds.forEach(async (id) => {
          const userChatsRef = doc(db, "chats", id);
          const userChatsSnapshot = await getDoc(userChatsRef);

          if (userChatsSnapshot.exists()) {
            const userChatData = userChatsSnapshot.data();
            // console.log(messagesId);
            const chatIndex = userChatData.chatData.findIndex(
              (c) => c.messageId === messagesId
            );

            // update last message for left side bar
            userChatData.chatData[chatIndex].lastMessage = input.slice(0, 30);

            userChatData.chatData[chatIndex].updatedAt = Date.now();

            if (userChatData.chatData[chatIndex].rId === userData.id) {
              userChatData.chatData[chatIndex].messageSeen = false;
            }

            await updateDoc(userChatsRef, {
              chatData: userChatData.chatData,
            });
          }
        });
      }
    } catch (error) {
      toast.error(error.message);
    }

    // clear chat input box, once msg is sent
    setInput("");
  };

  //load messages
  useEffect(() => {
    if (messagesId) {
      const unSub = onSnapshot(doc(db, "messages", messagesId), (res) => {
        setMessages(res.data().messages.reverse());
        console.log(res.data().messages.reverse());
      });
      return () => {
        unSub();
      };
    }
  }, [messagesId]);

  //convert time stamp
  const convertTimeStamp = (timestamp) => {
    let date = timestamp.toDate();
    const hour = date.getHours();
    const min = date.getMinutes();

    if (hour > 12) {
      return hour - 12 + ":" + min + "PM";
    } else {
      return hour + ":" + min + "AM";
    }
  };

  //get last seen of users
  const lastSeenMsg = (timestamp) => {
    const date = new Date(timestamp);

  // Format DD/MM/YY
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear().toString().slice(-2); // Get last 2 digits

  // Format time
  let hour = date.getHours();
  let min = date.getMinutes().toString().padStart(2, '0');
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;

  return `${day}/${month}/${year} at ${hour}:${min} ${ampm}`;
  };
  

  //send images in chat
  const sendImage = async (e) => {
    try {
      const fileUrl = await upload(e.target.files[0]);
      if (fileUrl && messagesId) {
        await updateDoc(doc(db, "messages", messagesId), {
          messages: arrayUnion({
            sId: userData.id,
            image: fileUrl,
            createdAt: new Date(),
          }),
        });

        const userIds = [chatUser.rId, userData.id];

        // update last seen
        userIds.forEach(async (id) => {
          const userChatsRef = doc(db, "chats", id);
          const userChatsSnapshot = await getDoc(userChatsRef);

          if (userChatsSnapshot.exists()) {
            const userChatData = userChatsSnapshot.data();
            // console.log(messagesId);
            const chatIndex = userChatData.chatData.findIndex(
              (c) => c.messageId === messagesId
            );

            // update last message for left side bar as: IMAGE
            userChatData.chatData[chatIndex].lastMessage = "Image";

            userChatData.chatData[chatIndex].updatedAt = Date.now();

            if (userChatData.chatData[chatIndex].rId === userData.id) {
              userChatData.chatData[chatIndex].messageSeen = false;
            }

            await updateDoc(userChatsRef, {
              chatData: userChatData.chatData,
            });
          }
        });
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // when you click on a user from left search bar, display his/her chatUser, else display LOGO screen
  return chatUser ? (
    <div className="chat-box">
      <div className="chat-user">
        <img src={chatUser.userData.avatar} alt="" />
        <p>
          {chatUser.userData.name.split(0,16)} {/* display green dot/active now  */}
          {Date.now() - chatUser.userData.lastSeen <= 70000 ? (
            <img src={assets.green_dot} className="dot" alt="" />
          ) :  <span className="last-seen text-[11px] text-amber-800 ">
          &nbsp; • Last seen On: {lastSeenMsg(chatUser.userData.lastSeen)}
            </span>
          }
        </p>
        <img src={assets.help_icon} className="help" alt="" />
      </div>

      {/* displaying chats */}
      <div className="chat-msg">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.sId === userData.id ? "s-msg" : "r-msg"}
          >
            {msg["image"] ? (
              <img
                className="msg-img border border-amber-600"
                src={msg.image}
                alt="images"
              />
            ) : (
              <p className="msg"> {msg.text} </p>
            )}

            <div>
              <img
                src={
                  msg.sId === userData.id
                    ? userData.avatar
                    : chatUser.userData.avatar
                }
                alt=""
              />
              <p>{convertTimeStamp(msg.createdAt)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          className="input-msg"
          type="text"
          placeholder="Send a message"
        />
        <input
          onChange={sendImage}
          type="file"
          id="image"
          accept="image/png, image/jpeg, image/jpg"
          hidden
        />
        <label htmlFor="image">
          <img src={assets.gallery_icon} alt="" />
        </label>
        <img onClick={sendMessage} src={assets.send_icon} alt="" />
      </div>
    </div>
  ) : (
    <div className="chat-welcome w-[100%] flex flex-col items-center justify-center gap-[5px] bg-[#C88A35] ">
      <img src={assets.logo_big} alt="logo" className="w-[160px]" />
    </div>
  );
};

export default ChatBox;
