import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';

import { Provider } from 'react-redux';

import App from './App.jsx';
import HomePage from './pages/HomePage.jsx';
import ProductPage from './pages/ProductPage.jsx';
import store from './store.js';
import CartPage from './pages/CartPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import Register from './pages/Register.jsx';
import Shipping from './pages/Shipping.jsx';
import Payment from './pages/Payment.jsx';
import PrivateRoutes from './components/PrivateRoutes.jsx';
import PlaceOrder from './pages/PlaceOrder.jsx';
import OrderScreen from './pages/Order.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import SuccessPage from './pages/SuccessPage.jsx';
import AdminRoutes from './components/AdminRoutes.jsx';
import UserListPage from './pages/admin/UserListPage.jsx';

import './index.css';
import ProductListPage from './pages/admin/ProductListPage.jsx';
import OrderListPage from './pages/admin/OrderListPage.jsx';
import ProductEditPage from './pages/admin/ProductEditPage.jsx';
import UserEditScreen from './pages/admin/UserEditScreen.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index path='/' element={<HomePage />} />
      <Route path='/search/:keyword' element={<HomePage />} />
      <Route path='/page/:pageNumber' element={<HomePage />} />
      <Route path='/product/:id' element={<ProductPage />} />
      <Route path='/cart' element={<CartPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<Register />} />
      <Route path='/reset-password/:resetToken' element={<ResetPassword />} />

      {/* admin private routes */}
      <Route path='/' element={<AdminRoutes />}>
        <Route path='/admin/users' element={<UserListPage />} />
        <Route path='/admin/users/:id/edit' element={<UserEditScreen />} />
        <Route path='/admin/products' element={<ProductListPage />} />
        <Route
          path='/admin/products/:pageNumber'
          element={<ProductListPage />}
        />
        <Route path='/admin/orders' element={<OrderListPage />} />
        <Route path='/admin/product/:id/edit' element={<ProductEditPage />} />
      </Route>
      {/* end admin private routes */}

      {/* private routes */}
      <Route path='' element={<PrivateRoutes />}>
        <Route path='/payment' element={<Payment />} />
        <Route path='/shipping' element={<Shipping />} />
        <Route path='/place-order' element={<PlaceOrder />} />
        <Route path='/order/:id' element={<OrderScreen />} />
        <Route path='/profile' element={<ProfilePage />} />
        <Route path='/success-screen' element={<SuccessPage />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
