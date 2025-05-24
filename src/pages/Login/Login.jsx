import React, { useState } from 'react'
import './Login.css'
import assets from '../../assets/assets.js'
import { signup, login, resetPass } from '../../config/firebase.js'

const Login = () => {

  const [currentState, setCurrentState]=useState("Sign up");
  const [username, setUsername]=useState("");
  const [email, setEmail]=useState("");
  const [password, setPassword]=useState("");

  const onSubmitHandler= (event)=>{
    event.preventDefault();
    if(currentState==="Sign up"){
      signup(username,email,password);
    }
    else{
      login(email,password);
    }
  }

  return (
    <div className='login flex'>
      <div className=''>
        <img src={assets.logo_big_rev} alt="" className="logo"/>
      </div>

      <div className=''>
      <form className='login-form' onSubmit={onSubmitHandler}>

        <h2 className=''>{currentState}</h2>
        {currentState==="Sign up" ? <input type="text" onChange={(e)=>setUsername(e.target.value)} value={username} className="form-input" placeholder="username" required /> : null}
        <input type="email" onChange={(e)=>setEmail(e.target.value)} value={email} className="form-input" placeholder="Email address" required />
        <input type="password" onChange={(e)=>setPassword(e.target.value)} value={password} className="form-input" placeholder="password" required />
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

          {currentState==="Login"
            ? <p className="login-toggle">Forgot Password ? &nbsp; <span onClick={()=>resetPass(email)} className='text-white font-medium'>Reset Password</span></p>  
            : null
          }
        </div>

      </form>
      </div>
    </div>
  )
}

export default Login