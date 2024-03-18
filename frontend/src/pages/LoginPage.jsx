/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaGoogle } from 'react-icons/fa';
import { toast } from 'react-toastify';

import {
  useForgotPasswordMutation,
  useLoginMutation,
} from '../slices/userApiSlice';
import { setCredentials } from '../slices/userSlice';
import LoaderSpinner from './../components/LoaderSpinner';
import { BACKEND_URL } from '../constants';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.user);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const [login, { isLoading, error }] = useLoginMutation();
  const [forgotPassword, { isLoading: isPasswordLoading }] =
    useForgotPasswordMutation();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();

      dispatch(setCredentials({ ...res }));
      navigate('/');
      toast.success('Login Successful');
    } catch (error) {
      toast.error(error?.data?.message || error?.error, {
        autoClose: 2000,
      });
    }
  };

  const handleForgotPassword = async () => {
    if (!email) toast.error('Please enter your email');
    else {
      try {
        const res = await forgotPassword({ email }).unwrap();
        toast.success(res.message);
      } catch (error) {
        toast.error(error?.data?.message || error?.error);
      }
    }
  };

  // google auth
  const handleGoogleAuth = () => {
    try {
      window.location.href = `${BACKEND_URL}/auth/google/callback`;
    } catch (error) {
      toast.error(error?.data?.message || error?.error);
    }
  };

  return (
    <section>
      <div className='container mx-auto mt-8 mb-28 p-4 max-w-md'>
        <h2 className='text-2xl text-center font-semibold mb-4'>Login</h2>

        <form onSubmit={handleLogin} className='border p-6 w-full'>
          <div className='mb-4'>
            <label htmlFor='email' className='text-gray-700 font-medium'>
              Email
            </label>
            <input
              type='email'
              id='email'
              className='bg-white border border-gray-300 p-2 rounded-md mt-2 w-full outline-none'
              placeholder='Enter your email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className='mb-4'>
            <label htmlFor='password' className='text-gray-700 font-medium'>
              Password
            </label>
            <input
              type='password'
              id='password'
              className='bg-white border border-gray-300 p-2 rounded-md mt-2 w-full outline-none'
              placeholder='Enter your password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <p className='mt-1 flex items-center gap-1 text-gray-700'>
            Forgot your password?
            <span
              className='text-blue-500 cursor-pointer font-medium'
              onClick={handleForgotPassword}
            >
              Reset here
            </span>
          </p>

          {isPasswordLoading && <LoaderSpinner />}

          <div className='flex flex-col mx-auto w-full'>
            <button
              disabled={isLoading}
              onClick={handleLogin}
              type='submit'
              className='bg-blue-500 font-medium text-white px-4 py-2 rounded-md mt-4 hover:opacity-80'
            >
              Login
            </button>

            <button
              type='submit'
              className='flex items-center justify-center font-medium gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md mt-4'
              onClick={handleGoogleAuth}
            >
              <FaGoogle size={20} />
              Login with Google
            </button>
          </div>

          {isLoading && <LoaderSpinner />}
          {error && <h3>{error?.message}</h3>}
        </form>

        <p className='mt-4 flex items-center gap-1 font-medium text-gray-700'>
          Don't have an account?
          <Link className='text-blue-500 font-semibold' to={'/register'}>
            Create One!
          </Link>
        </p>
      </div>
    </section>
  );
};

export default LoginPage;
