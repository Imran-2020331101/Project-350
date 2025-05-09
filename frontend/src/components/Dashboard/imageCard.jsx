import React from 'react'
import { useNavigate } from 'react-router-dom'

const ImageCard = () => {
  const navigate = useNavigate();

  return (
    <div className='w-[170px] h-[200px] rounded-2xl bg-white  flex flex-col justify-start items-center relative'>
      <div className='w-full h-full rounded-2xl bg-black-1/5 absolute flex flex-col justify-center items-center text-xl font-semibold'>Post</div>
      <img className='  w-full h-full object-cover rounded-2xl ' src="https://media.gettyimages.com/id/1319983757/photo/aerial-view-of-boats-in-sea-baishpur-bangladesh.jpg?s=612x612&w=0&k=20&c=LKVG04yOKSGC6d4qbk07aVUMg2oOYYIXHrxRj_2EAjU=" alt="" />
      {/* <button onClick={()=>navigate('/blog')} className='w-[100px] h-[30px] mt-3 bg-white shadow-lg shadow-gray-500 font-semibold text-black rounded-lg flex justify-center '>view blog</button> */}
    </div>
  )
}

export default ImageCard
