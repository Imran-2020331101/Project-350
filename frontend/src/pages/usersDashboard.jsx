import React from 'react'
import { Outlet } from 'react-router-dom'
import Profile from '../components/Dashboard/Profile'


const UsersDashboard = () => {
  return (
    <div className='w-screen min-h-screen flex'>
      <Profile/>
      <Outlet/>
    </div>
  )
}

export default UsersDashboard
