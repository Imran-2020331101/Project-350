import React from 'react'
import {Routes, Route, useNavigate} from 'react-router-dom'

const UserProfile = () => {
  const navigate = useNavigate();

  return (
    <div className='h-full w-[30%] fixed flex flex-col justify-start items-center pt-[30px] gap-3 '>
      <div className=" w-[150px] h-[150px] rounded-full bg-gray-900 text-white">
        <img className='rounded-full w-full h-full' src="https://img.freepik.com/premium-photo/man-face-black-linear-cartoon-icon-user-isolated-white-background-ai-generated_1095381-16859.jpg?ga=GA1.1.1802669302.1717663847&semt=ais_hybrid" alt="" />
      </div>
      <p className='text-2xl'>Name</p>
      <section className='w-[80%] h-[300px] overflow-y-scroll flex flex-col justify-start items-center border-solid border-white gap-8'>
               <div className=''>
                <p className='text-3xl font-semibold mb-2'>Visit your trips</p>
                <button onClick={()=>navigate('/newtrip')} className='w-[200px] h-[30px] rounded-2xl shadow-md shadow-white text-lg mt-2 font-medium bg-indigo-500 opacity-75 hover:opacity-100'>Plan new trip</button>
               </div>
               <div className="w-[80%] h-10 shadow-md shadow-white rounded-lg flex justify-center items-center text-md font-semibold">cox's bazar</div>
               <div className="w-[80%] h-10 shadow-md shadow-white rounded-lg flex justify-center items-center text-md font-semibold">cox's bazar</div>
               <div className="w-[80%] h-10 shadow-md shadow-white rounded-lg flex justify-center items-center text-md font-semibold">cox's bazar</div>
               <div className="w-[80%] h-10 shadow-md shadow-white rounded-lg flex justify-center items-center text-md font-semibold">cox's bazar</div>
               <div className="w-[80%] h-10 shadow-md shadow-white rounded-lg flex justify-center items-center text-md font-semibold">cox's bazar</div>
               <div className="w-[80%] h-10 shadow-md shadow-white rounded-lg flex justify-center items-center text-md font-semibold">cox's bazar</div>
               <div className="w-[80%] h-10 shadow-md shadow-white rounded-lg flex justify-center items-center text-md font-semibold">cox's bazar</div>
               
               
              
      </section>
      <button onClick={()=>navigate('/logout')} className='mr-4 mt-4 w-[280px]  h-8 font-semibold text-lg bg-red-900 text-white  hover:opacity-100 rounded-lg'>Logout</button>
0
    </div>
  )
}

export default UserProfile
