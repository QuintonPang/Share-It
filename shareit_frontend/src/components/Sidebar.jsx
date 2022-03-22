import React from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { RiHomeFill } from 'react-icons/ri'
import { IoIosArrowForward, IoMdAdd } from 'react-icons/io'
import { categories } from '../utils/data'
import logo from '../assets/logo.png'
import { AiOutlineLogout } from 'react-icons/ai'

const Sidebar = ({user,closeToggle}) => {

  // const categories = [
  //   { name: "animals"},
  //   { name: "gaming "},
  //   { name: "codng "},
  // ]

  const isNotActiveStyle = 'flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize'
  const isActiveStyle = 'flex items-center px-5 gap-3 font-extrabold border-r-2 border-black transition-all duration-200 ease-in-out capitalize'
  
  const handleCloseSidebar = () =>{
    // if close toggle exists
    if(closeToggle) closeToggle(false)
  }

  const navigate = useNavigate()
  return (
    <div className="flex flex-col justify-between bg-white h-full overflow-y-scroll min-w-210 scrollbar">
      <div className="flex flex-col">
        {/* gap is gap between rows and columns in grid and flexbox layout*/}
        {/* logo link */}
        <Link
          onClick={handleCloseSidebar}
          to="/"
          className="flex px-5 gap-2 my-6 pt-1 w-190 items-center"
          >
            <img src={logo} alt="logo" className="w-full"/>
          </Link>
          <div className="flex flex-col gap-5">
            {/* Navlink allows to check if the link is active or not by giving isActive props*/}
            <NavLink
              onClick={handleCloseSidebar}
              to="/"
              className={({isActive})=>isActive?isActiveStyle:isNotActiveStyle}
            >
              <RiHomeFill/>
              Home
            </NavLink>
            <NavLink
              onClick={handleCloseSidebar}
              to="/create-pin"
              className={({isActive})=>isActive?isActiveStyle:isNotActiveStyle}
            >
              <IoMdAdd/>
              Create
            </NavLink>
            <NavLink
              onClick={()=>{
                handleCloseSidebar()
                localStorage.clear()
                navigate('/login')
              }}
              to="/login"
              className={({isActive})=>isActive?isActiveStyle:isNotActiveStyle}
            >
              <AiOutlineLogout color="red" fontSize={21}/>
              Logout
            </NavLink>
            <h3 className="mt-2 px-5 text-base 2xl:text-xl">Discover Categories</h3>
            {/* does not include 'others' as category*/}
            {categories.slice(0,categories.length-1).map((category)=>(
              <NavLink
                onClick={handleCloseSidebar}
                className={({isActive})=>isActive?isActiveStyle:isNotActiveStyle}
                to={`/category/${category.name}`}
                key={category.name}
                >
                  <img src={category.image} className='w-8 h-8 rounded-full shadow-sm' alt='category'/>
                  {category.name}
              </NavLink>
            ))}
          </div>
      </div>
      {user&&(
        <Link
          to={`user-profile/${user._id}`}
          className="flex my-5 mb-3 gap-2 p-2 items-center bg-white rounded-lg shadow-lg mx-3"
          onClick={handleCloseSidebar}
        >
          <img src={user.image} className="w-10 h-10 rounded-full" alt="user-profile" />
          <p>{user.userName}</p>
        </Link>
      )}
    </div>
  )
}

export default Sidebar