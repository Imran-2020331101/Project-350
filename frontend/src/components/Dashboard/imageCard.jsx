import React from 'react'

const ImageCard = ({ photo, onClick }) => {
  return (
    <div 
      className='w-[170px] h-[200px] rounded-2xl bg-white flex flex-col justify-start items-center relative cursor-pointer hover:shadow-lg transition-shadow duration-200'
      onClick={() => onClick(photo)}
    >
      <img 
        className='w-full h-full object-cover rounded-2xl' 
        src={photo.url} 
        alt={photo.caption || "Gallery image"} 
      />
      {/* Optional: Add a small overlay indicator */}
      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 rounded-2xl flex items-center justify-center">
        <span className="text-white opacity-0 hover:opacity-100 transition-opacity duration-200 text-xs">
          Click to view
        </span>
      </div>
    </div>
  )
}

export default ImageCard
