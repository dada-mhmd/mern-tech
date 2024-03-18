import express from 'express';
const router = express.Router();

import {
  getProduct,
  getProducts,
  updateProduct,
  createProduct,
  deleteProduct,
  createProductReview,
} from '../controllers/productsCtrl.js';

import { admin, protect } from './../middlewares/authMiddleware.js';

router.route('/').get(getProducts).post(protect, admin, createProduct);
router
  .route('/:id')
  .get(getProduct)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

router.route('/:id/review').post(protect, createProductReview);

export default router;
