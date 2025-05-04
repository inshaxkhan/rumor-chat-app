import React, { useState } from 'react'
import './ProfileUpdate.css'
import './../../assets/assets.js'
import assets from './../../assets/assets.js'

const ProfileUpdate = () => {
  const [image, setImage]=useState(false);

  return (
    <div className='profile'>
      <div className="profile-container">
        <form action="">
          <h3>Profile Details</h3>
          <label htmlFor="avatar">
            <input type="file" onChange={(e)=>setImage(e.target.files[0])} id="avatar" accept=".png, .jpg, .jpeg" hidden />
            <img src={image? URL.createObjectURL(image) : assets.avatar_icon} alt="" />
            Upload Profile Image
          </label>
          <input type="text" placeholder='Your name' required />
          <textarea name="" id="" placeholder='Write profile bio'></textarea>
          <button type="submit">Save</button>
        </form>
        <img className='profile-pic' src={image? URL.createObjectURL(image) : assets.logo_icon} alt="" />
      </div>
    </div>
  )
}

export default ProfileUpdate