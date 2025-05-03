import React, { useState } from 'react'
import './Login.css'
import assets from '../../assets/assets.js'

const Login = () => {

  const [currentState, setCurrentState]=useState("Sign up");

  return (
    <div className='login'>
      <img src={assets.logo_big_rev} alt="" className="logo"/>

      <form className='login-form'>

        <h2 className=''>{currentState}</h2>
        {currentState==="Sign up" ? <input type="text" className="form-input" placeholder="username" required /> : null}
        <input type="email" className="form-input" placeholder="Email address" required />
        <input type="password" className="form-input" placeholder="password" required />
        <button type="submit">{currentState==="Sign up" ? "Create Account" : "Login Now"}</button>

        {currentState==="Sign up" ?
        <div className="login-term">
          <input type="checkbox" />
          <p> Agree to the terms of use & privacy policy. </p>
        </div>
        : null
        }

        <div className="login-forgot">
          {currentState==="Sign up" 
            ? <p className="login-toggle">Already have an account? &nbsp; <span onClick={()=>setCurrentState("Login")} className='text-white font-medium'>Login here</span></p>
            : <p className="login-toggle">Create an account &nbsp; <span onClick={()=>setCurrentState("Sign up")} className='text-white font-medium'>Sign up here</span></p> 
          }
        </div>

      </form>

    </div>
  )
}

export default Login