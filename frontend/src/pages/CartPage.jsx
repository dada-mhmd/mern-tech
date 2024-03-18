import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaTrash } from 'react-icons/fa';
import { removeFromCart } from '../slices/cartSlice';

const thStyles = `px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider`;
const tdStyles = `px-6 py-4 whitespace-nowrap truncate text-sm font-medium text-gray-900`;

const CartPage = () => {
  const { cartItems, taxPrice, shippingPrice, totalPrice, itemsPrice } =
    useSelector((state) => state.cart);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const total = cartItems.reduce((acc, item) => acc + +item.qty, 0);

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  const handleDeleteItem = (id) => {
    // delete item
    dispatch(removeFromCart(id));
  };

  return (
    <>
      {cartItems?.length === 0 ? (
        <h2 className='text-center mt-20 font-semibold text-lg md:text-2xl text-gray-800'>
          Cart is empty
        </h2>
      ) : (
        <section className='grid grid-cols-1 md:grid-cols-2 mt-4'>
          <div className='overflow-x-auto'>
            <table className='w-full divide-y divide-gray-200'>
              <thead>
                <tr>
                  <th className={thStyles}>Image</th>
                  <th className={thStyles}>Name</th>
                  <th className={thStyles}>Quantity</th>
                  <th className={thStyles}>Price</th>
                  <th className={thStyles}>Action</th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {cartItems?.map((product) => (
                  <tr key={product._id}>
                    <td className={tdStyles}>
                      <img
                        src={product?.image}
                        alt={product?.name}
                        className='h-16 w-16 object-contain rounded-full'
                      />
                    </td>
                    <td className={`${tdStyles}`}>
                      {product?.name.slice(0, 20)}..
                    </td>
                    <td className={`${tdStyles} text-center`}>
                      {product?.qty}
                    </td>
                    <td className={tdStyles}>{product?.price}</td>
                    <td className={tdStyles}>
                      <button
                        className='text-red-600 hover:text-red-800'
                        onClick={() => handleDeleteItem(product._id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className='md:w-1/2 col-span-1 bg-gray-100 p-4 w-full mx-auto'>
            <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
              Products Details
            </h2>
            <p className='text-gray-600'>
              <span className='text-gray-700 font-bold'>Total Items: </span>
              {total}
            </p>
            <p className='text-gray-600'>
              <span className='text-gray-700 font-bold'>Tax: </span>${taxPrice}
            </p>
            <p className='text-gray-600'>
              <span className='text-gray-700 font-bold'>Shipping: </span>$
              {shippingPrice}
            </p>
            <p className='text-gray-600'>
              <span className='text-gray-700 font-bold'>Products Price: </span>$
              {itemsPrice}
            </p>
            <p className='text-gray-600'>
              <span className='text-gray-700 font-bold'>Total Price: </span>$
              {totalPrice}
            </p>
            <button
              onClick={checkoutHandler}
              disabled={cartItems.length === 0}
              className='bg-blue-500 mt-4 text-white px-4 py-2 rounded-md hover:bg-blue-600'
            >
              Proceed to Checkout
            </button>
          </div>
        </section>
      )}
    </>
  );
};

export default CartPage;
