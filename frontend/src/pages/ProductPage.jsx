import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';

import {
  useCreateReviewMutation,
  useGetSingleProductQuery,
} from '../slices/productApiSlice';
import LoaderSpinner from '../components/LoaderSpinner';
import { addToCart } from '../slices/cartSlice';

const ProductPage = () => {
  const { id } = useParams();
  const [qty, setQty] = useState(1);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    data: product,
    isLoading,
    error,
    refetch,
  } = useGetSingleProductQuery(id);
  const [createReview] = useCreateReviewMutation();

  const [userComment, setUserComment] = useState('');
  const [userRating, setUserRating] = useState(5);

  if (error) {
    toast.error(error?.data?.message || error?.error);
  }

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate('/cart');
  };

  const createReviewHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await createReview({
        id,
        rating: userRating,
        comment: userComment,
      }).unwrap();
      toast.success(res.message);
      setUserComment('');
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || error?.error);
    }
  };

  return (
    <div className='container mx-auto mt-8 p-4'>
      <Link to='/'>
        <button className='bg-gray-800 text-white mr-1 px-4 py-2 rounded-md mb-4'>
          Go Back
        </button>
      </Link>
      {isLoading ? (
        <LoaderSpinner />
      ) : error ? (
        toast.error(error?.data?.message || error?.error)
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div className='md:col-span-1'>
            <img
              src={product?.image}
              alt={product?.name}
              className='w-full h-auto'
            />
          </div>

          <div className='md:col-span-1'>
            <h1 className='text-2xl font-semibold'>{product?.name}</h1>
            <p className='text-gray-700 mt-2'>{product?.description}</p>

            <div className='flex items-center mt-2'>
              <span className='mr-1'>{product?.rating}</span>
              <span className=''>({product?.numReviews}) reviews</span>
            </div>

            <p className='text-gray-700 mt-2'>${product?.price?.toFixed(2)}</p>
            <p className='text-gray-700 mt-2'>
              In Stock: {product?.countInStock}
            </p>

            <div className='mt-4'>
              <label htmlFor='quantity' className='text-gray-700'>
                Quantity
              </label>
              <select
                onChange={(e) => setQty(e.target.value)}
                name='quantity'
                id='quantity'
                className='bg-white border border-gray-300 p-2 rounded-md mt-2'
              >
                {[...Array(product?.countInStock).keys()].map((x) => (
                  <option key={x + 1} value={x + 1}>
                    {x + 1}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={addToCartHandler}
              className='px-4 py-2 rounded-md bg-gray-800 hover:bg-opacity-90 mt-4 text-white'
            >
              Add to Cart
            </button>
          </div>
        </div>
      )}
      <div className='mt-8'>
        <h2 className='text-xl font-semibold'>Customer Reviews</h2>
        <div className='mt-4'>
          <ul>
            {product?.reviews?.map((r, i) => (
              <div
                key={i}
                className='border rounded-md py-3 px-4 mb-4 shadow-sm'
              >
                <div className='flex items-center'>
                  {[...Array(r.rating).keys()].map((x) => (
                    <span className='text-yellow-400 text-xl mr-1' key={x}>
                      &#9733;
                    </span>
                  ))}
                </div>
                <p className='text-gray-700'>{r.comment}</p>
                <p className='text-gray-700 fw-medium'>{r.name}</p>
              </div>
            ))}
          </ul>
        </div>
        <div className='mt-4'>
          <h3 className='text-lg font-semibold'>Write a Review</h3>
          <div className='mt-2'>
            <label htmlFor='userReview' className='text-gray-700'>
              Your Review:
            </label>
            <textarea
              id='userReview'
              className='bg-white border border-gray-300 p-2 rounded-md mt-2 w-full'
              rows='4'
              placeholder='Write your review here...'
              value={userComment}
              onChange={(e) => setUserComment(e.target.value)}
            />
          </div>
          <div className='mt-2'>
            <label htmlFor='rating' className='text-gray-700 mr-2'>
              Rating:
            </label>
            <select
              id='rating'
              className='bg-white border border-gray-300 p-2 rounded-md mt-2'
              value={userRating}
              onChange={(e) => setUserRating(e.target.value)}
            >
              {[...Array(5)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={createReviewHandler}
            className='bg-blue-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-blue-600'
          >
            Submit Review
          </button>
        </div>
        <div className='mt-4'>
          <h3 className='text-lg font-semibold'>Write a Review</h3>
          <p className='text-gray-700'>
            Please
            <Link to='/login' className='text-blue-500 hover:underline mx-1'>
              login
            </Link>
            to write a review.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
