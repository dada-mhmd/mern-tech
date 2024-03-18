import express from 'express';
import {
  addOrderItems,
  getOrderById,
  getOrders,
  getUserOrders,
  updateOrderToDelivered,
} from '../controllers/orderCtrl.js';
import { admin, protect } from './../middlewares/authMiddleware.js';
const router = express.Router();

router.post('/', protect, addOrderItems);
router.get('/user-orders', protect, getUserOrders);
router.get('/', protect, admin, getOrders);
router.get('/:id', protect, getOrderById);
router.patch('/deliver/:id', protect, admin, updateOrderToDelivered);

export default router;
