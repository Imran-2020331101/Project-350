import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signedOut, selectIsSignedIn } from '../../redux/authSlice';

const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isSignedIn = useSelector(selectIsSignedIn);
  console.log(isSignedIn);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative bg-white dark:bg-[#1e293b] text-gray-800 dark:text-white w-[90%] sm:w-[400px] rounded-2xl shadow-xl p-8 space-y-6 transition-all duration-300">
        {/* Close Icon */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-white text-xl transition"
        >
          &times;
        </button>

        {/* Message */}
        <div className="text-center">
          <h2 className="text-2xl font-bold">Log out</h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
            Are you sure you want to log out of your account?
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <button
            onClick={() =>{ 
              dispatch(signedOut());
              navigate('/')
            }}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-semibold shadow transition duration-150"
          >
            Yes, Log Out
          </button>
          <button
            onClick={() => navigate(-1)}
            className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-2 px-4 rounded-lg font-semibold shadow transition duration-150"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout;
