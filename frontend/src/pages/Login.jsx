import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { login, reset } from '../features/auth/authSlice';
import { toast } from 'react-toastify';
import Spinner from '../components/layout/Spinner';
import { FaSignInAlt } from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
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
  
  if (isLoading) {
    return <Spinner />;
  }
  
  return (
    <section className="page-container">
      <div className="max-w-md mx-auto">
        <div className="card">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaSignInAlt className="text-3xl text-primary-600" />
            </div>
            <h1 className="page-title mb-2">Login</h1>
            <p className="text-gray-600">Sign in to your account</p>
          </div>
          
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                    Email
                  </label>
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    className="input-field"
                    placeholder="Enter your email"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 mt-1 text-sm"
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                    Password
                  </label>
                  <Field
                    type="password"
                    id="password"
                    name="password"
                    className="input-field"
                    placeholder="Enter your password"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 mt-1 text-sm"
                  />
                </div>
                
                <button
                  type="submit"
                  className="btn-primary w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Logging in...' : 'Login'}
                </button>
              </Form>
            )}
          </Formik>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-600 hover:text-primary-800 font-medium">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login; 