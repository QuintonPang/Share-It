import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AiOutlineLogout } from 'react-icons/ai'
// import { GoogleLogout } from 'react-google-login'
import { userCreatedPinsQuery, userQuery, userSavedPinsQuery } from '../utils/data'
import { client } from '../client'
import MasonryLayout from './MasonryLayout'
import Spinner from './Spinner'
import { fetchUser } from '../utils/fetchUser'
import { getAuth, signOut } from "firebase/auth";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [pins, setPins] = useState(null);
  const [text, setText] = useState('Created') // either 'created' or 'saved'
  const [activeBtn, setActiveBtn] = useState('created')
  const navigate = useNavigate()
  const { userId } = useParams()

  const randomImage = 'https://source.unsplash.com/1600x900/?nature,photography,technology'

  const activeBtnStyles="bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none"
  const notActiveBtnStyles="bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none"

  const currentUser = fetchUser()

  const logout = () =>{
    localStorage.clear()
    navigate('/login')
  }
  useEffect(()=>{
    const query = userQuery(userId)
    client.fetch(query)
    .then(d=>{
      setUser(d[0])
    })
  },[userId])

  useEffect(()=>{
   if(text==='Created'){
    const createdPinsQuery = userCreatedPinsQuery(userId)
    client.fetch(createdPinsQuery)
    .then(d=>{
      setPins(d)
    })
   }else{
    const savedPinsQuery = userSavedPinsQuery(userId)
    client.fetch(savedPinsQuery)
    .then(d=>{
      setPins(d)
    })
   }
  },[text,userId])
  
  if(!user) return <Spinner message="Loading profile..."/>

  return (
    <div className="relative pb-2 h-full justify-center items-center">
      <div className="h-screen flex flex-col pb-5">
        <div className="overflow-y-scroll relative flex flex-col mb-7">
          <div className="flex flex-col justify-center items-center">
            <img
              src={randomImage}
              className="w-full h-370 2xl:h-510 shadow-lg object-cover"
              alt="banner"
            />
            <img
              className="rounded-full w-20 h-20 mt-10 shadow-xl object-cover"
              src={user.image}
              alt="user-profile"
            />
            <h1 className="font-bold text-3xl text-center mt-3">
              {user.userName}
            </h1>
            <div className="absolute top-0 z-1 right-0 p-2">
              {/* check if current profile page belongs to current user */}
              {user._id === currentUser?.uid&&(
                
                // firebase
                <button
                    type="button"
                    className="bg-white p-2 rounded-full cursor-pointer outline-none shadow-md"
                    onClick={()=>{
                      signOut(getAuth()).then(() => {
                        // Sign-out successful.
                        logout()
                      }).catch((error) => {
                        // An error happened.
                      });
                    }}
                  >
                    <AiOutlineLogout color="red" fontSize={21}/>
                  </button>

                /* react google login
                <GoogleLogout
                clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
                render={(renderProps)=>(
                  <button
                    type="button"
                    className="bg-white p-2 rounded-full cursor-pointer outline-none shadow-md"
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                  >
                    <AiOutlineLogout color="red" fontSize={21}/>
                  </button>
                )}
                onLogoutSuccess={logout}
                cookiePolicy="single_host_origin"
                />
                */
              )
              }
            </div>
          </div>
          <div className="text-center mb-7">
            <button
              onClick={e=>{
                setText(e.target.textContent) // referring to text in button
                setActiveBtn('created')
              }}
              className={`${activeBtn==='created'?activeBtnStyles:notActiveBtnStyles}`}
            >
              Created
            </button>
            <button
              onClick={e=>{
                setText(e.target.textContent) // referring to text in button
                setActiveBtn('saved')
              }}
              className={`${activeBtn==='saved'?activeBtnStyles:notActiveBtnStyles}`}
            >
              Saved
            </button>
          </div>
          {pins?.length?
            <div className="px-2">
              <MasonryLayout pins={pins}/>
            </div>
          :
            <div className="flex justify-center font-bold items-center w-full text-xl mt-2">
              No pins found!
            </div>}
        </div>
      </div>
    </div>
  )
}

export default UserProfile