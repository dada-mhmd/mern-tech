import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useResetPasswordMutation } from '../slices/userApiSlice';
import LoaderSpinner from '../components/LoaderSpinner';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const { resetToken } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
    } else {
      await resetPassword({ resetToken, password }).unwrap();
      toast.success('Password reset successful');
      navigate('/login');
    }
  };

  return (
    <section>
      <div className='container mx-auto mt-8 mb-28 p-4 max-w-md'>
        <h2 className='text-2xl text-center font-semibold mb-4'>
          Reset Password
        </h2>

        <form className='border p-6 w-full' onSubmit={handleResetPassword}>
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
            <label htmlFor='confPassword' className='text-gray-700 font-medium'>
              Confirm Password
            </label>
            <input
              type='password'
              id='confPassword'
              className='bg-white border border-gray-300 p-2 rounded-md mt-2 w-full outline-none'
              placeholder='Confirm password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            onClick={handleResetPassword}
            type='submit'
            className='bg-blue-500 font-medium text-white px-4 py-2 rounded-md mt-4 hover:opacity-80'
          >
            Reset Password
          </button>

          {isLoading && <LoaderSpinner />}
        </form>
      </div>
    </section>
  );
};

export default ResetPassword;
