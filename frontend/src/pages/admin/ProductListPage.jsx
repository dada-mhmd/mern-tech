import { toast } from 'react-toastify';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetProductsQuery,
} from '../../slices/productApiSlice';
import LoaderSpinner from './../../components/LoaderSpinner';
import { useNavigate, useParams } from 'react-router-dom';
import Paginate from '../../components/Paginate';
import { useSelector } from 'react-redux';

export const ProductListPage = () => {
  const navigate = useNavigate();
  const { pageNumber } = useParams();

  const { data, isLoading, error, refetch } = useGetProductsQuery({
    pageNumber,
  });

  const [createProduct, { isLoading: loadingCreate }] =
    useCreateProductMutation();

  const [deleteProduct, { isLoading: loadingDelete }] =
    useDeleteProductMutation();

  const { userInfo } = useSelector((state) => state.user);

  if (isLoading) return <LoaderSpinner />;
  if (error) return toast.error(error?.data?.message || error?.error);

  const createProductHandler = async () => {
    if (window.confirm('Are you sure you want to create a new product?')) {
      try {
        await createProduct();
        refetch();
        toast.success('Product created successfully');
      } catch (error) {
        toast.error(error?.data?.message || error?.error);
      }
    }
  };

  const editProductHandler = (id) => {
    navigate(`/admin/product/${id}/edit`);
  };

  const deleteProductHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const res = await deleteProduct(id);
        refetch();
        toast.success(res.message);
      } catch (error) {
        toast.error(error?.data?.message || error?.error);
      }
    }
  };

  return (
    <div>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-semibold mb-4'>Products</h2>
        <button
          onClick={createProductHandler}
          className='bg-blue-500 text-white px-4 py-2 rounded-md mb-4'
        >
          Create Product
        </button>

        {loadingCreate && <LoaderSpinner />}
      </div>
      <table className='min-w-full divide-y divide-gray-200'>
        <thead>
          <tr>
            <th className='px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'>
              ID
            </th>
            <th className='px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'>
              Name
            </th>
            <th className='px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'>
              Price
            </th>
            <th className='px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'>
              Brand
            </th>
            <th className='px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'>
              Actions
            </th>
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
          {data?.products?.map((product) => (
            <tr key={product._id}>
              <td className='px-6 py-4 whitespace-nowrap'>{product?._id}</td>
              <td className='px-6 py-4 whitespace-nowrap'>{product?.name}</td>
              <td className='px-6 py-4 whitespace-nowrap'>${product?.price}</td>
              <td className='px-6 py-4 whitespace-nowrap'>{product?.brand}</td>

              <td className='px-6 py-4 flex gap-x-3 text-lg whitespace-nowrap'>
                <button
                  onClick={() => editProductHandler(product?._id)}
                  className='text-blue-500 hover:text-blue-700'
                >
                  <FiEdit />
                </button>

                <button
                  onClick={() => deleteProductHandler(product?._id)}
                  className='text-red-500 hover:text-red-700'
                >
                  <FiTrash2 />
                </button>
              </td>
            </tr>
          ))}

          {loadingDelete && <LoaderSpinner />}
        </tbody>
      </table>

      <div className='flex justify-center mt-12'>
        <Paginate
          pages={data?.pages}
          pageNumber={data?.pageNumber}
          isAdmin={userInfo?.isAdmin}
        />
      </div>
    </div>
  );
};

export default ProductListPage;
