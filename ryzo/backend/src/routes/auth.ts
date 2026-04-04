import { Router } from 'express';
import { googleAuth, refreshToken } from '../controllers/authController';

const router = Router();

// POST /api/auth/google — Authenticate with Google
router.post('/google', googleAuth);

// POST /api/auth/refresh — Refresh JWT token
router.post('/refresh', refreshToken);

export default router;
