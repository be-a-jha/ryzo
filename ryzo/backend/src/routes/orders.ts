import { Router } from 'express';
import { createOrder, getOrder, updateOrderStatus } from '../controllers/orderController';

const router = Router();

// POST /api/orders — Create a new order
router.post('/', createOrder);

// GET /api/orders/:id — Get order by ID
router.get('/:id', getOrder);

// PATCH /api/orders/:id/status — Update order status
router.patch('/:id/status', updateOrderStatus);

export default router;
