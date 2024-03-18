import express from 'express';
import { protect, admin } from './../middlewares/authMiddleware.js';

import {
  deleteUser,
  forgotPassword,
  getUserById,
  getUsers,
  login,
  logout,
  register,
  resetPassword,
  updateUser,
  updateUserDetails,
} from '../controllers/userCtrl.js';

const router = express.Router();

router.route('/').get(protect, admin, getUsers);
router
  .route('/:id')
  .put(protect, admin, updateUserDetails)
  .get(protect, admin, getUserById)
  .delete(protect, admin, deleteUser);
router.route('/login').post(login);
router.route('/register').post(register);
router.route('/update').put(updateUser);
router.route('/logout').post(logout);
router.route('/forgot-password').post(forgotPassword);
router.route('/reset-password/:resetToken').patch(resetPassword);

export default router;
