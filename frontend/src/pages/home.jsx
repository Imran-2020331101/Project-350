import React from 'react'
import Welcome from '../components/Welcome'
import Mytrips from './Mytrips'

const Home = () => {
  return (
    <div className='w-screen h-auto flex flex-col items-center justify-start'>
      <Welcome/>
      <Mytrips/>
    </div>
  )
}

export default Home
