import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
  useGetUserByIdQuery,
  useUpdateUserDetailsMutation,
} from '../../slices/userApiSlice';
import LoaderSpinner from '../../components/LoaderSpinner';

const UserEditScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: user, isLoading: loadingUser } = useGetUserByIdQuery(id);
  const [updateUserDetails, { isLoading }, refetch] =
    useUpdateUserDetailsMutation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user?.name || '');
      setEmail(user?.email || '');
      setIsAdmin(user?.isAdmin || false);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUserDetails({ name, email, isAdmin, id });
      toast.success('User updated successfully');
      navigate('/admin/users');
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || error?.error);
    }
  };

  if (!user || loadingUser) {
    return <LoaderSpinner />;
  }

  return (
    <div className='flex flex-col justify-center items-center'>
      <h2 className='text-2xl font-bold my-4'>Edit User</h2>
      <form onSubmit={handleSubmit} className='w-full max-w-sm'>
        <div className='mb-4'>
          <label htmlFor='name' className='block text-gray-700 font-bold mb-2'>
            Name
          </label>
          <input
            type='text'
            id='name'
            className='w-full border border-gray-300 p-2 rounded-md'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className='mb-4'>
          <label htmlFor='email' className='block text-gray-700 font-bold mb-2'>
            Email
          </label>
          <input
            type='email'
            id='email'
            className='w-full border border-gray-300 p-2 rounded-md'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className='mb-4'>
          <label htmlFor='isAdmin' className='block text-gray-700 font-bold'>
            Is Admin
          </label>
          <input
            type='checkbox'
            id='isAdmin'
            className='mr-2'
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
          />
        </div>
        <button
          type='submit'
          className='bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600'
        >
          Update
        </button>

        {isLoading && <LoaderSpinner />}
      </form>
    </div>
  );
};

export default UserEditScreen;
