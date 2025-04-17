import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { login, reset } from '../features/auth/authSlice';
import { toast } from 'react-toastify';
import Spinner from '../components/layout/Spinner';
import { FaSignInAlt, FaGoogle, FaFacebook, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaShieldAlt, FaCar } from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );
  
  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    
    // Redirect when logged in
    if (isSuccess || user) {
      navigate('/');
      console.log('User data stored:', JSON.parse(localStorage.getItem('user')));
    }
    
    dispatch(reset());
  }, [isError, isSuccess, user, message, navigate, dispatch]);
  
  const initialValues = {
    email: '',
    password: '',
  };
  
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required'),
  });
  
  const onSubmit = (values) => {
    dispatch(login(values));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  if (isLoading) {
    return <Spinner />;
  }
  
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Left Side - Site Name and Blurred Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img 
          src="/images/login-car.jpg" 
          alt="Luxury Car" 
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 backdrop-blur-sm bg-gray-900/60 flex flex-col justify-center items-center">
          <div className="text-center p-12">
            <h1 className="text-5xl font-bold mb-4 font-poppins">
              <span className="text-white">Car</span>
              <span className="text-highlight-500">Zone</span>
            </h1>
            <p className="text-2xl text-white/90 mb-6 max-w-md">
              Premium automotive parts and accessories marketplace
            </p>
            <div className="flex justify-center space-x-6 mt-8">
              <div className="flex items-center">
                <div className="rounded-full bg-white/20 p-3 backdrop-blur-md">
                  <FaShieldAlt className="text-white text-xl" />
                </div>
                <span className="text-white text-lg ml-3">Premium Quality</span>
              </div>
              <div className="flex items-center">
                <div className="rounded-full bg-white/20 p-3 backdrop-blur-md">
                  <FaLock className="text-white text-xl" />
                </div>
                <span className="text-white text-lg ml-3">Secure Login</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link to="/" className="inline-block mb-6">
              <div className="flex items-center justify-center">
                <FaCar className="text-highlight-500 dark:text-highlight-400 text-3xl mr-2" />
                <span className="text-2xl font-bold">
                  <span className="text-gray-900 dark:text-white">Car</span>
                  <span className="text-highlight-500 dark:text-highlight-400">Zone</span>
                </span>
              </div>
            </Link>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Sign in to your account</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Or{' '}
              <Link to="/register" className="font-medium text-highlight-500 hover:text-highlight-600 dark:text-highlight-400 dark:hover:text-highlight-300 transition-colors duration-300">
                create a new account
              </Link>
            </p>
          </div>
          
          <div className="flex justify-center space-x-4 mt-6">
            <button className="group flex items-center justify-center py-2 px-4 border border-gray-300 dark:border-gray-700 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:border-highlight-500 dark:hover:border-highlight-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-highlight-500 dark:focus:ring-offset-gray-800 transition-all duration-300 w-full max-w-[150px]">
              <FaGoogle className="mr-2 text-highlight-500" />
              Google
            </button>
            <button className="group flex items-center justify-center py-2 px-4 border border-gray-300 dark:border-gray-700 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:border-highlight-500 dark:hover:border-highlight-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-highlight-500 dark:focus:ring-offset-gray-800 transition-all duration-300 w-full max-w-[150px]">
              <FaFacebook className="mr-2 text-highlight-500" />
              Facebook
            </button>
          </div>
          
          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Or continue with</span>
            </div>
          </div>
          
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="mt-8 space-y-6">
                <div className="rounded-md -space-y-px">
                  <div className="relative mb-4">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <FaEnvelope />
                    </div>
                    <Field
                      type="email"
                      id="email"
                      name="email"
                      className="appearance-none relative block w-full px-10 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-md focus:outline-none focus:ring-highlight-500 focus:border-highlight-500 dark:focus:ring-highlight-400 dark:focus:border-highlight-400 focus:z-10 sm:text-sm transition-colors duration-300"
                      placeholder="Email address"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 mt-1 text-xs"
                    />
                  </div>
                  
                  <div className="relative mb-2">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <FaLock />
                    </div>
                    <Field
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      className="appearance-none relative block w-full px-10 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-md focus:outline-none focus:ring-highlight-500 focus:border-highlight-500 dark:focus:ring-highlight-400 dark:focus:border-highlight-400 focus:z-10 sm:text-sm transition-colors duration-300"
                      placeholder="Password"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 mt-1 text-xs"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-highlight-600 focus:ring-highlight-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <a href="#" className="font-medium text-highlight-500 hover:text-highlight-600 dark:text-highlight-400 dark:hover:text-highlight-300 transition-colors duration-300">
                      Forgot your password?
                    </a>
                  </div>
                </div>
                
                <div>
                  <button
                    type="submit"
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-highlight-500 hover:bg-highlight-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-highlight-500 dark:focus:ring-offset-gray-800 transition-all duration-300"
                    disabled={isSubmitting}
                  >
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <FaSignInAlt className="h-4 w-4 text-highlight-300 group-hover:text-highlight-200" />
                    </span>
                    {isSubmitting ? 'Signing in...' : 'Sign in'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
          
          <div className="text-center mt-4">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              By signing in, you agree to our{' '}
              <a href="#" className="text-highlight-500 hover:text-highlight-600 dark:text-highlight-400 dark:hover:text-highlight-300 transition-colors duration-300">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-highlight-500 hover:text-highlight-600 dark:text-highlight-400 dark:hover:text-highlight-300 transition-colors duration-300">
                Privacy Policy
              </a>
            </p>
            
            <div className="mt-6">
              <Link to="/" className="text-sm text-gray-600 hover:text-highlight-500 dark:text-gray-400 dark:hover:text-highlight-400 flex items-center justify-center transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 