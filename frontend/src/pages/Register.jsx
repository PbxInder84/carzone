import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { register, reset } from '../features/auth/authSlice';
import { toast } from 'react-toastify';
import Spinner from '../components/layout/Spinner';
import { FaUserPlus } from 'react-icons/fa';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );
  
  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    
    // Redirect when registered
    if (isSuccess || user) {
      navigate('/');
    }
    
    dispatch(reset());
  }, [isError, isSuccess, user, message, navigate, dispatch]);
  
  const initialValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  };
  
  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Name is required')
      .min(3, 'Name must be at least 3 characters'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required'),
    role: Yup.string()
      .oneOf(['user', 'seller'], 'Invalid role')
      .required('Role is required'),
  });
  
  const onSubmit = (values) => {
    const { name, email, password, role } = values;
    
    dispatch(register({
      name,
      email,
      password,
      role,
    }));
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
              <FaUserPlus className="text-3xl text-primary-600" />
            </div>
            <h1 className="page-title mb-2">Register</h1>
            <p className="text-gray-600">Create your new account</p>
          </div>
          
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                    Name
                  </label>
                  <Field
                    type="text"
                    id="name"
                    name="name"
                    className="input-field"
                    placeholder="Enter your name"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 mt-1 text-sm"
                  />
                </div>
                
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
                
                <div className="mb-4">
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
                
                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
                    Confirm Password
                  </label>
                  <Field
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className="input-field"
                    placeholder="Confirm your password"
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-red-500 mt-1 text-sm"
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="role" className="block text-gray-700 font-medium mb-2">
                    Account Type
                  </label>
                  <Field
                    as="select"
                    id="role"
                    name="role"
                    className="input-field"
                  >
                    <option value="user">Customer</option>
                    <option value="seller">Seller</option>
                  </Field>
                  <ErrorMessage
                    name="role"
                    component="div"
                    className="text-red-500 mt-1 text-sm"
                  />
                </div>
                
                <button
                  type="submit"
                  className="btn-primary w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating Account...' : 'Register'}
                </button>
              </Form>
            )}
          </Formik>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-800 font-medium">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register; 