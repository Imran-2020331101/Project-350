import React from 'react'
import { useNavigate , Link} from 'react-router-dom'
import Travel from './travel';


const Itinerary = () => {
    const navigate = useNavigate();
  return (
    <div className='w-[100%] h-full mt-11  flex justify-end pr-25' >

        <section className='w-[70%] h-full  bg-gray-900 text-white' >
            <div className="fixed top-12 left-0px h-10 w-56  flex gap-[2px]">
            <Link to='/dashboard/experience'>
                <button  className='w-[100%] h-full rounded-lg shadow-sm shadow-white font-semibold text-xl' >
                        Experience
                </button>
            </Link>
            </div>
            <Travel/>
        
        </section>
      
    </div>
  )
}

export default Itinerary
