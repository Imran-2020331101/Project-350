import React from 'react'
import UserProfile from '../components/Dashboard/userProfile'
import { Outlet } from 'react-router-dom'


const UsersDashboard = () => {
  return (
    <div className='w-screen min-h-screen flex'>
      <UserProfile/>
      <Outlet/>
    </div>
  )
}

export default UsersDashboard
