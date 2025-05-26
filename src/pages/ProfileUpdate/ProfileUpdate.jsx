import React, { useContext, useEffect, useState } from 'react'
import './ProfileUpdate.css'
import './../../assets/assets.js'
import assets from './../../assets/assets.js'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from '../../config/firebase.js'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import upload from '../../lib/upload.js'
import { AppContext } from '../../context/AppContext.jsx'

const ProfileUpdate = () => {
  const navigate=useNavigate();

  const [image, setImage]=useState(false);
  const [name, setName]=useState("");
  const [bio, setBio]=useState("");
  const [uid, setUid]=useState("");
  const [prevImage, setPrevImage]=useState("");
  const {setUserData}=useContext(AppContext)

  const profileUpdate=async(event)=>{
    event.preventDefault();
    try {

      if(!prevImage && !image){
        toast.error("Upload Profile Image");
      }
      const docRef=doc(db,"users",uid);

      if(image){
        const imgUrl=await upload(image);
        setPrevImage(imgUrl);
        await updateDoc(docRef,{
          avatar:imgUrl,
          bio:bio,
          name:name
        })
      }
      else{
        await updateDoc(docRef,{
          bio:bio,
          name:name
        })
      }
      const snap=await getDoc(docRef);
      setUserData(snap.data());
      navigate('/chat');

    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  }

  useEffect(()=>{
    onAuthStateChanged(auth ,async(user)=>{
      if(user){
        setUid(user.uid);
        const docRef=doc(db,"users",user.uid);
        const docSnap=await getDoc(docRef);

        if(docSnap.data().name){
          setName(docSnap.data().name);
        }

        if(docSnap.data().bio){
          setBio(docSnap.data().bio);
        }

        if(docSnap.data().avatar){
          setPrevImage(docSnap.data().avatar);
        }
      }
      else{
        navigate('/');
      }
    })
  },[])
  return (
    <div className='profile'>
      <div className="profile-container">
        <form onSubmit={profileUpdate}>
          <h3>Profile Details</h3>

          <label htmlFor="avatar">
            <input type="file" onChange={(e)=>setImage(e.target.files[0])} id="avatar" accept=".png, .jpg, .jpeg" hidden />
            <img src={image? URL.createObjectURL(image) : assets.avatar_icon} alt="" />
            Upload Profile Image
          </label>

          <input onChange={(e)=>setName(e.target.value)} value={name} type="text" placeholder='Your name' required />
          <textarea onChange={(e)=>setBio(e.target.value)} value={bio} name="" id="" placeholder='Write profile bio'></textarea>
          <button type="submit">Save</button>

        </form>

        <div className='imgdiv'>
          <img src={assets.arrow_icon} className='arrow-img' onClick={()=>navigate(-1)}/>

          <img className='profile-pic' src={image? URL.createObjectURL(image) : prevImage ? prevImage : assets.logo_icon} alt="" />
        </div>
      </div>
    </div>
  )
}

export default ProfileUpdate