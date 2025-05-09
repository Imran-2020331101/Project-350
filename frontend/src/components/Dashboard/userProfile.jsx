import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Trips } from '../../DemoInfo/Trips';


const UserProfile = () => {
  const navigate = useNavigate();
  
  const user= useSelector((state)=>state.auth.user)
  const myTrips = Trips.filter((trip)=>trip.owner==user.id) 


  return (
    <aside className="h-full w-[30%] fixed flex flex-col items-center pt-8 gap-4">
      {/* Profile Image */}
      <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg">
        <img
          src="https://img.freepik.com/premium-photo/man-face-black-linear-cartoon-icon-user-isolated-white-background-ai-generated_1095381-16859.jpg?ga=GA1.1.1802669302.1717663847&semt=ais_hybrid"
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>

      {/* User Name */}
      <h2 className="text-2xl font-bold text-gray-100">{user.name}</h2>
      <p className="text-sm text-gray-300 px-4 text-center leading-relaxed max-w-[90%] break-words">
        {user.bio}
      </p>


      {/* Trips Section */}
      <div className="text-center">
        <p className="text-xl font-semibold mb-2">Your trips</p>
      </div>
      
      {/* Trip Items */}
      <section className="w-[80%] max-h-[300px] overflow-y-auto flex flex-col items-center gap-4 pb-2">
        {myTrips.map((trip, index) => (
          <div
            key={index}
            className="w-full min-h-10 bg-gray-100 shadow rounded-lg flex items-center justify-center text-sm font-medium text-black hover:bg-gray-200 transition"
          >
            {trip.destination}
          </div>
        ))}
      </section>

      {/* Logout Button */}
      <button
        onClick={() => navigate('/logout')}
        className="mt-6 w-[80%] h-10 bg-red-700 text-white font-semibold rounded-lg hover:bg-red-800 transition"
      >
        Logout
      </button>
    </aside>
  );
};

export default UserProfile;
