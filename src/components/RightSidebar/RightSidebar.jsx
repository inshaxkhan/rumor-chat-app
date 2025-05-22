import React, { useContext, useEffect, useRef, useState } from "react";
import "./RightSidebar.css";
import "./../../assets/assets.js";
import assets from "./../../assets/assets.js";
import { logout } from "../../config/firebase.js";
import { AppContext } from "../../context/AppContext.jsx";

const RightSidebar = () => {
  const { chatUser, messages } = useContext(AppContext);

  //for updating media in rightSideBar, based on user's you chat
  const [msgImages, setMsgImages] = useState([]);
  useEffect(() => {
    let tempVar = [];
    messages.map((msg) => {
      if (msg.image) {
        tempVar.push(msg.image);
      }
    });

    // console.log(tempVar);

    setMsgImages(tempVar);
  }, [messages]);


  // for displaying selected media in a new div

  const [activeMedia, setActiveMedia] = useState(null);
  const popupRef = useRef();

  // Close popup if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setActiveMedia(null);
      }
    };

    if (activeMedia) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeMedia]);

  return chatUser ? (
    <div className="rs">
      <div className="rs-profile">
        <img src={chatUser.userData.avatar} alt="" />
        <h3>
          {" "}
          {chatUser.userData.name.slice(0, 15)}{" "}
          <img src={assets.green_dot} className="dot" alt="" />{" "}
        </h3>
        <p>{chatUser.userData.bio}</p>
      </div>

      <hr />

      <div className="rs-media">
        <p>Media</p>
        <div>
          {msgImages.map((url, index) => (
            <img
              onClick={() => setActiveMedia(url)}
              className="border border-[#c68729]"
              key={index}
              src={url}
              alt=""
            />
          ))}




        </div>
      </div>

      <button onClick={() => logout()}>Logout</button>

{/* for showing images/media clicked: in full size */}
      {activeMedia && (
            <div className="fixed top-0 bottom-0 left-0 right-0  z-30 flex items-center justify-center text-gray-600 bg-black/50">
              <div
                ref={popupRef}
                className="max-w-[300px] md:max-w-[500px] md:max-h-[800px]  bg-white shadow-lg border-2 border-[#c68729] flex items-center justify-center"
              >
                <img
                  src={activeMedia}
                  alt="Popup"
                  className="max-w-full max-h-full object-contain"
                />
                
              </div>
            </div>
          )}


    </div>
  ) : (
    <div className="rs">
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
};

export default RightSidebar;
