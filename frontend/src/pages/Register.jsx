import {useState} from 'react'
import { useNavigate} from 'react-router-dom'
import { useDispatch } from 'react-redux';
import {registerUser} from '../redux/authSlice'
import { toast } from 'react-toastify';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [showPassword,setShowPassword] = useState(false);
    const [showConfirmPassword,setShowConfirmPassword] = useState(false);

    const navigate= useNavigate();
    const dispatch = useDispatch();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    console.log(formData)

    const signUp = async (e) => {
        e.preventDefault();
        
        const {name, email, password, confirmPassword} = formData;

        if(!password || !email || !name || !confirmPassword || password!==confirmPassword){
            toast.error('Please fill all fields correctly and ensure passwords match');
            return;
        }
        try {
            await dispatch(registerUser({ name, email, password })).unwrap();
            toast.success("Registration successful! Please log in to continue.");
            // Clear form data
            setFormData({
                name: '',
                email: '',
                password: '',
                confirmPassword: ''
            });
            // Redirect to login page
            navigate('/login');
        } catch (err) {
            toast.error(`Registration failed: ${err}`);
            console.log("Error signing up : " + err);
        }
    }

    return (
        <section className="fixed top-0 left-0 backdrop-blur-[7px] bg-blue-800/20 h-screen w-full  font-sans z-[100]">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto ">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
                    <div
                        className="flex justify-end"
                        onClick={() => navigate(-1)}
                    >
                        <p className="px-4 hover:cursor-pointer text-black">x</p>
                    </div>
                      <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                            Create an account
                        </h1>
                        <div className="space-y-4 md:space-y-6" action="#">
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block mb-2 text-sm font-medium text-gray-900"
                                >
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                    placeholder="full name"
                                    required
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block mb-2 text-sm font-medium text-gray-900"
                                >
                                    Your email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                    placeholder="example@gmail.com"
                                    required={true}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                            <label
                                htmlFor="password"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    id="password"
                                    placeholder="••••••••"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 pr-10"
                                    required
                                    onChange={handleChange}
                                />
                                <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-600"
                                tabIndex={-1}
                                >
                                {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                                </button>
                            </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="confirmPassword"
                                    className="block mb-2 text-sm font-medium text-gray-900"
                                >
                                    Confirm password
                                </label>
                                <div className='relative'>
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        id="confirmPassword"
                                        placeholder="••••••••"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                        required
                                        onChange={handleChange}  
                                        />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-600"
                            tabIndex={-1}
                            >
                            {showConfirmPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                            </button>
                                </div>
                            </div>
                            <button
                                onClick={signUp}
                                className="w-full text-white font-semibold bg-slate-700 hover:bg-slate-800 focus:ring-4 focus:outline-none rounded-lg text-sm px-5 py-2.5 text-center "
                            >
                                Create an account
                            </button>
                            <p className="text-sm font-light text-gray-500">
                                Already have an account?{" "}
                                <p
                                    
                                    className="font-medium hover:underline "
                                    onClick={()=>navigate('/login')}
                                >
                                    Login here
                                </p>
                            </p>
                        </div>
                    </div>                    
                </div>
            </div>
        </section>
    );
}

export default Register