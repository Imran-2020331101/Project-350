import React, { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { allUsers ,  status , addUser} from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import {postUsers} from '../redux/authSlice'

/**
 * Auth Component
 * --------------
 * A login interface for authenticating users.
 * 
 * Features:
 * - Accepts user email and password via controlled form inputs.
 * - Dispatches `postUsers` thunk to authenticate user credentials.
 * - Navigates to the dashboard if login is successful (based on Redux `status`).
 * - Uses Redux to access authentication state (`allUsers`, `status`).
 * - Responsive design with TailwindCSS and form validation.
 * - Includes navigation back to home or registration page.
 * 
 * Dependencies:
 * - React hooks (`useState`, `useEffect`)
 * - React Router DOM (`useNavigate`)
 * - Redux (`useDispatch`, `useSelector`)
 * 
 * Note:
 * - Login result is dependent on the `status` value in the Redux store.
 * - `postUsers` must correctly update the Redux state for navigation to succeed.
 */

const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const currentStatus = useSelector(status);
    const users = useSelector(allUsers);
    const navigate = useNavigate(); 


    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            const user = dispatch(postUsers({email, password}));
            console.log(user.status, 'user');
            if(currentStatus === 'success'){
                navigate('/dashboard');
            }
        } catch (error) {
            console.log(error.message);
        }
        }
        
    return (
        <section className="fixed top-0 left-0 backdrop-blur-[7px] h-screen w-full  font-sans z-10">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
                    <div className="flex justify-end">
                        <p onClick={()=>navigate(-1)} className="px-4  text-gray-600 text-[20px] cursor-pointer hover:text-gray-900 transition ease-in-out delay-75 hover:-translate-y-1 hover:scale-110 duration-100">
                            x
                        </p>
                    </div>
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                            Sign in to your account
                        </h1>
                        <div className="space-y-4 md:space-y-6">
                            <div>
                                <label
                                    for="email"
                                    className="block mb-2 text-sm font-medium text-gray-900"
                                >
                                    Your email
                                </label>
                                <input
                                    name="email"
                                    id="email"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                                    placeholder="example@gmail.com"
                                    required={true}
                                    value={email}
                                    onChange={(e)=>setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label
                                    for="password"
                                    className="block mb-2 text-sm font-medium text-gray-900"
                                >
                                    Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="••••••••"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                                    required={true}
                                    value={password}
                                    onChange={(e)=>setPassword(e.target.value)}
                                />
                            </div>
                            <button onClick={handleSubmit} className="w-full text-white bg-slate-700 hover:bg-slate-800 focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                Sign in
                            </button>
                            <p className="text-sm font-light text-gray-600">
                                Don’t have an account yet?{" "}
                                <p className="font-medium hover:underline cursor-pointer" onClick={()=>navigate('/register')}>
                                    Sign up
                                </p>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Auth;
