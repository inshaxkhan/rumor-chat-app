import React from 'react'
import './ChatBox.css'
import './../../assets/assets.js'
import assets from './../../assets/assets.js'

const ChatBox = () => {
  return (
    <div className='chat-box'>

      <div className="chat-user">
        <img src={assets.profile_ana} alt="" />
        <p>Ana Siddiqui <img src={assets.green_dot} className='dot' alt="" /> </p>
        <img src={assets.help_icon} className='help' alt="" />
      </div>

      <div className="chat-msg">

        <div className="s-msg">
          <p className="msg">This is a sender's message placeholder... </p>
          <div>
            <img src={assets.profile_brian} alt="" />
            <p>1:15 PM</p>
          </div>
        </div>

        <div className="s-msg">
          <img className='msg-img' src={assets.img1} alt="" />
          <div>
            <img src={assets.profile_brian} alt="" />
            <p>1:15 PM</p>
          </div>
        </div>

        <div className="r-msg">
          <p className="msg">This is a receiver's message placeholder... </p>
          <div>
            <img src={assets.profile_ana} alt="" />
            <p>1:15 PM</p>
          </div>
        </div>

      </div>

      <div className="chat-input">
        <input className='input-msg' type="text" placeholder='Send a message' />
        <input type="file" id='image' accept='image/png, image/jpeg, image/jpg' hidden />
        <label htmlFor="image">
          <img src={assets.gallery_icon} alt="" />
        </label>
        <img src={assets.send_icon} alt="" />
      </div>
    </div>
  )
}

export default ChatBox