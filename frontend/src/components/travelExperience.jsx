import React from 'react'
import { useNavigate , Link} from 'react-router-dom'
import Experiences from './experiences';

const TravelExperience = () => {
  const navigate = useNavigate();
  return (
    <div className='w-full h-full mt-11  flex justify-end pr-25' >

        <section className='w-[60%] h-full  bg-gray-900 text-white' >
              <Experiences/>
        </section>
      
    </div>
  )
}

export default TravelExperience
