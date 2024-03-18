import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FaGoogle } from 'react-icons/fa';
import { toast } from 'react-toastify';

import { useRegisterMutation } from '../slices/userApiSlice';
import { setCredentials } from '../slices/userSlice';
import LoaderSpinner from './../components/LoaderSpinner';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading, error }] = useRegisterMutation();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
    } else {
      try {
        const res = await register({
          name,
          email,
          password,
          confirmPassword,
        }).unwrap();

        dispatch(setCredentials({ ...res }));
        navigate('/login');
        toast.success('User created successfully');
      } catch (error) {
        toast.error(error?.data?.message || error?.error, {
          autoClose: 2000,
        });
      }
    }
  };

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
        <h2 className='text-2xl text-center font-semibold mb-4'>Register</h2>

        <form onSubmit={handleRegister} className='border p-6 w-full'>
          <div className='mb-4'>
            <label htmlFor='name' className='text-gray-700 font-medium'>
              Name
            </label>
            <input
              type='text'
              id='name'
              className='bg-white border border-gray-300 p-2 rounded-md mt-2 w-full outline-none'
              placeholder='Enter your name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

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

          <div className='mb-4'>
            <label
              htmlFor='confirmPassword'
              className='text-gray-700 font-medium'
            >
              Password
            </label>
            <input
              type='password'
              id='confirmPassword'
              className='bg-white border border-gray-300 p-2 rounded-md mt-2 w-full outline-none'
              placeholder='Confirm password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className='flex flex-col mx-auto w-full'>
            <button
              disabled={isLoading}
              onClick={handleRegister}
              type='submit'
              className='bg-blue-500 font-medium text-white px-4 py-2 rounded-md mt-4 hover:opacity-80'
            >
              Register
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
          Already have an account?
          <Link className='text-blue-500 font-semibold' to={'/login'}>
            Login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Register;
