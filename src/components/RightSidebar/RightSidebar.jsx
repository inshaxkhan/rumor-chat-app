import React from 'react'
import './RightSidebar.css'
import './../../assets/assets.js'
import assets from './../../assets/assets.js'

const RightSidebar = () => {
  return (
    <div className='rs'>

      <div className="rs-profile">
        <img src={assets.profile_ana} alt="" />
        <h3>Ana Siddiqui <img src={assets.green_dot} className='dot' alt="" /> </h3>
        <p>Hey, I am a Developer in Warsaw.</p>
      </div>

      <hr />

      <div className="rs-media">
        <p>Media</p>
        <div>
          <img src={assets.img1} alt="" />
          <img src={assets.img2} alt="" />
          <img src={assets.img3} alt="" />
          <img src={assets.img4} alt="" />
          <img src={assets.img5} alt="" />
          <img src={assets.img6} alt="" />
        </div>
      </div>

      <button>Logout</button>
    </div>
  )
}

export default RightSidebar