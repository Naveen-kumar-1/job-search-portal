import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import { toast } from "react-toastify";

const RecuiterLogin = () => {
  const [state, setState] = useState("Login");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(false);
  const [isTextDataSubmited, setIsTextDataSubmited] = useState(false);
  const navigate = useNavigate()
  const {setShowRecuirterLogin,backendUrl,setCompanyToken,setCompanyData} = useContext(AppContext);
  const onSubmitHandler = async (e)=>{
        e.preventDefault()
    if (state === 'Sign Up' && !isTextDataSubmited) {
       return setIsTextDataSubmited(true)
    }
      try {
        if(state === "Login"){
          const {data} = await axios.post(backendUrl+'/api/company/login',{email,password})
          if (data.success) {
          
            setCompanyData(data.company)
            setCompanyToken(data.token)
            localStorage.setItem('companyToken',data.token)
            setShowRecuirterLogin(false)
            navigate('/dashboard')
          }else{
            toast.error(data.message)
          }

        }else{
          const formData = new FormData()

          formData.append('name',name)
          formData.append('password',password)
          formData.append('email',email)
          formData.append('image',image)

          const {data } = await axios.post(backendUrl+'/api/company/register',formData)

          if (data.success) {
            setCompanyData(data.company)
            setCompanyToken(data.token)
            localStorage.setItem('companyToken',data.token)
            setShowRecuirterLogin(false)
            navigate('/dashboard')
            
          }else{
            toast.error(data.message)
          }




        }
      } catch (error) {
        
          toast.error(data.message)
        

      }
  }


  useEffect(()=>{
    document.body.style.overflow = 'hidden';
    return ()=>{
        document.body.style.overflow = 'unset';
    }
  },[])

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center ">
      <form onSubmit={onSubmitHandler} className="relative bg-white p-10 rounded-xl text-slate-500">
        <h1 className="text-center text-2xl text-neutral-700 font-medium">
          Recuiter {state}
        </h1>
        <p className="text-sm">Welcome Back! Please sign to continue</p>
        {state === "Sign Up" && isTextDataSubmited ? (
          <>
          <div className="flex items-center gap-4 my-10">
            <label htmlFor="image">
                <img src={image ? URL.createObjectURL(image) :  assets.upload_area} className="w-16 rounded-full" alt="" />
                <input onChange={e=>setImage(e.target.files[0])} type="file"  id="image" hidden/>
            </label>
            <p>Upload company <br/>Logo</p>
          </div>
          </>
        ) : (
          <>
            {state !== "Login" && (
              <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5 ">
                <img src={assets.person_icon} alt="" />
                <input
                  className="outline-none text-sm"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  placeholder="Company name"
                  required
                />
              </div>
            )}

            <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
              <img src={assets.email_icon} alt="" />
              <input
                onChange={(e) => setEmail(e.target.value)}
                className="outline-none text-sm"
                value={email}
                type="email"
                placeholder="Email ID"
                required
              />
            </div>
            <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
              <img src={assets.lock_icon} alt="" />
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="outline-none text-sm"
                type="password"
                placeholder="Password"
                required
              />
            </div>
          </>
        )}
        {state === 'Login' && <p className="text-sm text-blue-600 mt-4 cursor-pointer">
          Forgot password?
        </p>}
        

        <button type="submit" className="bg-blue-600 w-full text-white py-2 rounded-full mt-4">
          {state === "Login" ? "Login" :isTextDataSubmited ? "Create Account" : "Next"}
        </button>
        {state === "Login" ? 
          <p className="mt-5 text-center">
            Don't Have an account{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => setState("Sign Up")}
            >
              Sign up
            </span>
          </p>
         : 
          <p className="mt-5 text-center">
            Already Have an account{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => setState("Login")}
            >
              Login
            </span>
          </p>
        }
        <img src={assets.cross_icon} onClick={e => setShowRecuirterLogin(false)} className="absolute top-5 right-5 cursor-pointer" alt="" />
      </form>
    </div>
  );
};

export default RecuiterLogin;
