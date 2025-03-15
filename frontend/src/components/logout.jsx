import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch , useSelector} from 'react-redux';
import { signedOut } from '../redux/authSlice';
import { signedIn } from '../redux/authSlice';


const Logout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isSignedIn = useSelector(signedIn);
    console.log(isSignedIn);
  return (
    <div>
        <section className="fixed top-0 left-0 backdrop-blur-[7px] h-screen w-full  font-sans z-10">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
                    <div className="flex justify-end">
                        <p onClick={()=>navigate('/')} className="px-4  text-gray-600 text-[20px] cursor-pointer hover:text-gray-900 transition ease-in-out delay-75 hover:-translate-y-1 hover:scale-110 duration-100">
                            x
                        </p>
                    </div>
                    
                        <p className='text-black ml-12 font-medium mb-11 text-2xl'>Are you sure you want to log out?</p>
                        <div className="space-y-1 md:space-y-6">
                            
                            
                            <button onClick={()=>dispatch(signedOut())}  className="mb-[-15px] w-full text-white bg-red-900 hover:bg-red-700 focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                Logout
                            </button>
                            <button onClick={()=>navigate('/')} className="w-full text-white bg-slate-700  focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                Cancel
                            </button>
                            
                        </div>
                    
                </div>
            </div>
        </section>
      
    </div>
  )
}

export default Logout
