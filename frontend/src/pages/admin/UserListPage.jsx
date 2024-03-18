import {
  useDeleteUserMutation,
  useGetUsersQuery,
} from '../../slices/userApiSlice';
import LoaderSpinner from './../../components/LoaderSpinner';
import { toast } from 'react-toastify';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const UsersListScreen = () => {
  const { data: users, isLoading, error, refetch } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();

  const navigate = useNavigate();

  if (isLoading) return <LoaderSpinner />;
  if (error) return toast.error(error?.data?.message || error?.error);
  if (users?.length === 0) return <p>No users found</p>;

  const onEdit = (id) => {
    navigate(`/admin/users/${id}/edit`);

    refetch();
  };

  const deleteUserHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id).unwrap();
        toast.success('User deleted successfully');
        refetch();
      } catch (error) {
        toast.error(error?.data?.message || error?.error);
      }
    }
  };

  return (
    <div className='mx-auto px-4 py-8'>
      <h2 className='text-2xl font-bold mb-4'>Users</h2>
      <div className='overflow-x-auto'>
        <table className='min-w-full border-collapse border border-gray-300 text-center'>
          <thead>
            <tr className='bg-gray-200'>
              <th className='border border-gray-300 py-2 px-4 sm:px-6 md:px-8'>
                ID
              </th>
              <th className='border border-gray-300 py-2 px-4 sm:px-6 md:px-8'>
                Name
              </th>
              <th className='border border-gray-300 py-2 px-4 sm:px-6 md:px-8'>
                Email
              </th>
              <th className='border border-gray-300 py-2 px-4 sm:px-6 md:px-8'>
                isAdmin
              </th>
              <th className='border border-gray-300 py-2 px-4 sm:px-6 md:px-8'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {!isLoading &&
              !error &&
              users?.map((user) => (
                <tr key={user._id}>
                  <td className='border border-gray-300 py-2 px-4 sm:px-6 md:px-8'>
                    {user?._id}
                  </td>
                  <td className='border border-gray-300 py-2 px-4 sm:px-6 md:px-8'>
                    {user?.name}
                  </td>
                  <td className='border border-gray-300 py-2 px-4 sm:px-6 md:px-8'>
                    {user?.email}
                  </td>
                  <td className='border border-gray-300 py-2 px-4 sm:px-6 md:px-8'>
                    {user?.isAdmin ? 'True' : 'False'}
                  </td>

                  {!user.isAdmin && (
                    <td className='border border-gray-300 py-2 px-4 sm:px-6 md:px-8 space-x-2'>
                      <button
                        onClick={() => onEdit(user._id)}
                        className='text-blue-500 hover:text-blue-700'
                      >
                        <FiEdit />
                      </button>

                      <button
                        onClick={() => deleteUserHandler(user._id)}
                        className='text-red-500 hover:text-red-700'
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersListScreen;
