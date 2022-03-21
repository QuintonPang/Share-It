import React, { useEffect }  from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'

import Home from './containers/Home'
import Login from './components/Login'
import { fetchUser } from './utils/fetchUser'

const App = () => {

  const navigate = useNavigate()

  useEffect(()=>{
    // check if user is authenticated
    if(!fetchUser()) navigate('/login')
  },[])

  return ( 
    // before was <Switch>, latest is <Routes>
    <Routes>
      <Route path='login' element={<Login/>}/>
      <Route path='/*' element={<Home/>}/>
    </Routes>
  )
}

export default App