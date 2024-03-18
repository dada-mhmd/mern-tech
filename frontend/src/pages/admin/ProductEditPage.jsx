import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
  useGetSingleProductQuery,
  useUpdateProductMutation,
  useUploadFileHandlerMutation,
} from '../../slices/productApiSlice';
import LoaderSpinner from './../../components/LoaderSpinner';

const ProductEditScreen = () => {
  const { id: productId } = useParams();

  const { data: product, isLoading: loadingSingleProduct } =
    useGetSingleProductQuery(productId);

  const navigate = useNavigate();

  const [productData, setProductData] = useState({
    name: '',
    price: 0,
    image: '',
    brand: '',
    category: '',
    countInStock: 0,
    description: '',
  });

  useEffect(() => {
    if (product) {
      setProductData({
        name: product.name,
        price: product.price,
        image: product.image,
        brand: product.brand,
        category: product.category,
        countInStock: product.countInStock,
        description: product.description,
      });
    }
  }, [product]);

  const { name, price, image, brand, category, countInStock, description } =
    productData;

  const [updateProduct, { isLoading: loadingUpdate }, refetch] =
    useUpdateProductMutation();

  const [uploadFileHandler, { isLoading: uploadLoading }] =
    useUploadFileHandlerMutation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProduct({
        productId,
        name,
        price,
        image,
        brand,
        category,
        countInStock,
        description,
      }).unwrap();
      toast.success('Product updated successfully');
      navigate('/admin/products');
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || error?.error);
    }
  };

  if (loadingSingleProduct) {
    return <LoaderSpinner />;
  }

  const uploadImageHandler = async (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);

    try {
      const res = await uploadFileHandler(formData).unwrap();
      toast.success(res.message);
      setProductData({ ...productData, image: res.image });
    } catch (error) {
      toast.error(error?.data?.message || error?.error);
    }
  };

  return (
    <div className='w-1/3 mx-auto'>
      <h2 className='text-2xl font-semibold mb-4'>Edit Product</h2>
      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label htmlFor='name' className='block font-medium'>
            Name:
          </label>
          <input
            type='text'
            id='name'
            name='name'
            className='w-full border border-gray-300 p-2 rounded-md'
            value={name}
            onChange={handleInputChange}
          />
        </div>
        <div className='mb-4'>
          <label htmlFor='price' className='block font-medium'>
            Price:
          </label>
          <input
            type='number'
            id='price'
            name='price'
            className='w-full border border-gray-300 p-2 rounded-md'
            value={price}
            onChange={handleInputChange}
          />
        </div>
        <div className='mb-4'>
          <label htmlFor='image' className='block font-medium'>
            Image:
          </label>
          <input
            type='file'
            id='image'
            name='image'
            className='w-full border border-gray-300 p-2 rounded-md'
            accept='image/*'
            onChange={uploadImageHandler}
          />
        </div>
        <div className='mb-4'>
          <label htmlFor='brand' className='block font-medium'>
            Brand:
          </label>
          <input
            type='text'
            id='brand'
            name='brand'
            className='w-full border border-gray-300 p-2 rounded-md'
            value={brand}
            onChange={handleInputChange}
          />
        </div>
        <div className='mb-4'>
          <label htmlFor='category' className='block font-medium'>
            Category:
          </label>
          <input
            type='text'
            id='category'
            name='category'
            className='w-full border border-gray-300 p-2 rounded-md'
            value={category}
            onChange={handleInputChange}
          />
        </div>
        <div className='mb-4'>
          <label htmlFor='countInStock' className='block font-medium'>
            Count In Stock:
          </label>
          <input
            type='number'
            id='countInStock'
            name='countInStock'
            className='w-full border border-gray-300 p-2 rounded-md'
            value={countInStock}
            onChange={handleInputChange}
          />
        </div>
        <div className='mb-4'>
          <label htmlFor='description' className='block font-medium'>
            Description:
          </label>
          <textarea
            id='description'
            name='description'
            className='w-full border border-gray-300 p-2 rounded-md'
            value={description}
            onChange={handleInputChange}
          />
        </div>
        <div className='mb-4'>
          <button className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'>
            Update Product
          </button>

          {loadingUpdate && <LoaderSpinner />}
        </div>
      </form>
    </div>
  );
};
export default ProductEditScreen;
