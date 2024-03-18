import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import axios from 'axios';

import LoaderSpinner from '../components/LoaderSpinner';
import Product from '../components/Product';

import { useGetProductsQuery } from '../slices/productApiSlice';
import { BACKEND_URL } from '../constants';
import { setCredentials } from '../slices/userSlice';
import Paginate from '../components/Paginate';

const HomePage = () => {
  const dispatch = useDispatch();
  const { keyword, pageNumber } = useParams();

  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
  });

  const getUser = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/auth/login/success`, {
        withCredentials: true,
      });
      dispatch(
        setCredentials({
          ...res.data.user._json,
          _id: res.data._id,
          isAdmin: res.data.user.isAdmin,
        })
      );
    } catch (error) {
      toast.error(error?.data?.message || error?.error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  if (isLoading) return <LoaderSpinner />;
  if (error) {
    toast.error(error?.data?.message || error?.error);
  }

  return (
    <>
      <div className='grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 divide-x-2 divide-y-2'>
        {data?.products?.map((product, i) => (
          <Product key={i} product={product} />
        ))}
      </div>

      <div className='flex justify-center mt-12'>
        <Paginate
          pages={data?.pages}
          pageNumber={data?.pageNumber}
          keyword={keyword || ''}
        />
      </div>
    </>
  );
};

export default HomePage;
