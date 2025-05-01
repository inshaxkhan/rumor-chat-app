import React from 'react'
import './Login.css'
import assets from '../../assets/assets.js'

const Login = () => {
  return (
    <div className='login'>
      <img src={assets.logo_big_rev} alt="" className="logo"/>

      <form className='login-form'>

        <h2 className=''>Login</h2>
        <input type="text" className="form-input" placeholder="username" required />
        <input type="email" className="form-input" placeholder="Email address" required />
        <input type="password" className="form-input" placeholder="password" required />
        <button type="submit">Sign Up</button>
        <div className="login-term">
          <input type="checkbox" />
          <p> Agree to the terms of use & privacy policy. </p>
        </div>

        <div className="login-forgot">
          <p className="login-toggle">Already have an account? <span>click here</span></p>
        </div>

      </form>

    </div>
  )
}

export default Login