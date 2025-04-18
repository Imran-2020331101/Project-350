import React from 'react'
import { Link } from 'react-router-dom'
import MapComponent from './MapComponent'
import { test } from '../constants'

const Travel = () => {
  return (
    <div className= 'h-full w-full pt-5 pr-4 flex flex-col justify-start items-center  gap-[30px] pb-[40px]'>
      <p className='text-2xl font-semibold mb-5'>Destination</p>
      <section className='h-[120px] w-[50%]  flex flex-col justify-between items-center'>
            <p className='text-xl font-semibold'>Weather update</p>
            <div className="flex w-full h-[60px] justify-between items-end "> 
                <div className='w-[70px] h-[30px] flex flex-col justify-center items-center'>
                    <p className='text-2xl font-semibold'>30</p>
                    <p className='w-[70px] text-lg font-semibold'>Temperature</p>
                </div>
                <div className='w-[70px] h-[30px] flex flex-col justify-center items-center'>
                    <p className='text-2xl font-medium'>30</p>
                    <p className='w-[70px] text-lg font-semibold'>Rain</p>
                </div>
                <div className='w-[70px] h-[30px] flex flex-col justify-center items-center'>
                    <p className='text-2xl font-medium'>30</p>
                    <p className='w-[70px] text-lg font-semibold'>Weather</p>
                </div>
                
            </div>
      </section>
      <div  className='w-[700px] h-[200px]  overflow-y-scroll flex flex-col justify-start items-center mt-5'>
        <p className='text-xl font-semibold'>Description</p>
        <p className='text-lg '>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Unde cumque itaque corrupti reprehenderit suscipit.
         Veritatis, velit. Asperiores eius ex hic ipsum iure soluta, 
         nam quia excepturi voluptatem cupiditate neque veniam?
        </p>
      </div>

      <p className='text-xl font-semibold mb-[-10px]'>Travel</p>

      <div  className='w-full h-full overflow-y-scroll flex flex-col justify-start items-center mt-5'>
        <p className='text-xl font-semibold'>Places to visit</p>
        <MapComponent places={test} type={'hotels'}/>
        <p className='text-lg '>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Unde cumque itaque corrupti reprehenderit suscipit.
         Veritatis, velit. Asperiores eius ex hic ipsum iure soluta, 
         nam quia excepturi voluptatem cupiditate neque veniam?
        </p>
      </div >
        <p className='text-xl font-semibold'>
          Some hotels you can use
          </p>
        <ul className='flex flex-col w-[700px] h-[250px] overflow-y-scroll justify-start items-start gap-2'>
          {test && test.map((item)=> 
            <li  className='  w-full h-auto' key={item.name}>
                <p>{item.name}</p>
                <p>{item.formatted_location}</p>
            </li>
          )}
        </ul>
        <MapComponent places={test} type={'hotels'}/>
    </div>
  )
}

export default Travel
