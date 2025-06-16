import React from 'react'
import { useNavigate } from 'react-router-dom'

const ImageCard = ({source}) => {
  const navigate = useNavigate();

  return (
    <div className='w-[170px] h-[200px] rounded-2xl bg-white  flex flex-col justify-start items-center relative'>
      <img className='  w-full h-full object-cover rounded-2xl ' src={source} alt="An image from the gallery" />
      {/* <button onClick={()=>navigate('/blog')} className='w-[100px] h-[30px] mt-3 bg-white shadow-lg shadow-gray-500 font-semibold text-black rounded-lg flex justify-center '>view blog</button> */}
    </div>
  )
}

export default ImageCard
