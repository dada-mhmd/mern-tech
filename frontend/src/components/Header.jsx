import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FiShoppingCart, FiUser, FiLogOut, FiLogIn } from 'react-icons/fi';
import { FaCaretUp, FaCaretDown } from 'react-icons/fa';

import { useLogoutApiMutation } from '../slices/userApiSlice';
import { logout } from '../slices/userSlice';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { keyword: searchTerm } = useParams();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const [keyword, setKeyword] = useState(searchTerm || '');

  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.user);

  const [logoutApi] = useLogoutApiMutation();

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
      dispatch(logout());
      navigate('/login');
      toast.success('Logout successful');
    } catch (error) {
      toast.error(error?.data?.message || error?.error);
    }
  };

  const renderProfileButton = () => {
    return (
      <>
        <button
          onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          className='text-white flex items-center'
        >
          <FiUser className='mr-1' />
          {userInfo?.name}
          {isProfileMenuOpen ? <FaCaretUp /> : <FaCaretDown />}
        </button>
        <ul
          className={`absolute ${
            isProfileMenuOpen ? 'block' : 'hidden'
          } bg-gray-800 p-2 mt-2 space-y-2 text-white border rounded-md`}
        >
          <li>
            <Link to='/profile'>
              <FiUser className='mr-1' />
              Profile
            </Link>
          </li>
          <li>
            <Link onClick={handleLogout}>
              <FiLogOut className='mr-1' />
              Logout
            </Link>
          </li>
        </ul>
      </>
    );
  };

  const renderAdminButton = () => {
    return (
      <>
        <button
          onClick={() => setIsAdminMenuOpen((prev) => !prev)}
          className='text-white flex items-center'
        >
          <FiUser className='mr-1' />
          Admin
          {isAdminMenuOpen ? <FaCaretUp /> : <FaCaretDown />}
        </button>
        <ul
          className={`absolute ${
            isAdminMenuOpen ? 'block' : 'hidden'
          } bg-gray-800 p-2 mt-2 space-y-2 text-white border rounded-md`}
        >
          <li>
            <Link to='/admin/users'>Users</Link>
          </li>
          <li>
            <Link to='/admin/products'>Products</Link>
          </li>
          <li>
            <Link to='/admin/orders'>Orders</Link>
          </li>
        </ul>
      </>
    );
  };

  const renderSignInButton = () => (
    <Link className='flex items-center' to='/login'>
      <FiLogIn className='mr-1 text-white' />
      <button className='text-white'>Sign In</button>
    </Link>
  );

  const searchHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search/${keyword}`);
      setKeyword('');
    } else {
      navigate('/');
    }
  };

  return (
    <nav className='bg-gray-800 p-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center'>
          <Link to='/' className='text-white text-2xl font-extrabold'>
            Tech
          </Link>
          <form onSubmit={searchHandler} className='flex items-center'>
            <input
              type='text'
              placeholder='Search'
              className='ml-4 p-2 rounded-md bg-gray-700 text-white hidden sm:block'
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button
              onClick={searchHandler}
              className='bg-blue-500 text-white py-2 px-4 rounded-md hidden sm:block ml-2'
            >
              Search
            </button>
          </form>
        </div>
        <div className='hidden sm:flex items-center space-x-4'>
          <Link to='/cart' className='text-white flex items-center'>
            <FiShoppingCart className='mr-1' />
            Cart
            <span className='bg-blue-500 text-white rounded-full px-2 py-1 ml-2'>
              {cartItems.length}
            </span>
          </Link>
          {userInfo && (
            <div className='relative group'>{renderProfileButton()}</div>
          )}
          {userInfo?.isAdmin && (
            <div className='relative group'>{renderAdminButton()}</div>
          )}
          {!userInfo && renderSignInButton()}
        </div>
        <div className='sm:hidden'>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className='text-white text-xl focus:outline-none'
          >
            ☰
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className='mt-4 sm:hidden'>
          <input
            type='text'
            placeholder='Search'
            className='p-2 rounded-md bg-gray-700 text-white w-full mb-2'
          />
          <button className='bg-blue-500 text-white py-2 px-4 rounded-md w-full mb-2'>
            Search
          </button>
          <div className='space-y-2'>
            <Link to='/cart' className='text-white flex items-center'>
              <FiShoppingCart className='mr-1' />
              Cart
              <span className='bg-blue-500 text-white rounded-full px-2 py-1 ml-2'>
                {cartItems.length}
              </span>
            </Link>
            {userInfo && (
              <div className='relative group'>{renderProfileButton()}</div>
            )}
            {userInfo?.isAdmin && (
              <div className='relative group'>{renderAdminButton()}</div>
            )}
            {!userInfo && renderSignInButton()}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
