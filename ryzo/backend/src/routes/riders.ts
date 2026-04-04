import { Router } from 'express';
import { getNearbyRiders, updateRiderLocation, updateRiderStatus } from '../controllers/riderController';

const router = Router();

// GET /api/riders/nearby?lat=X&lng=Y&radiusKm=Z — Find nearby riders
router.get('/nearby', getNearbyRiders);

// PATCH /api/riders/:id/location — Update rider location
router.patch('/:id/location', updateRiderLocation);

// PATCH /api/riders/:id/status — Update rider online/offline status
router.patch('/:id/status', updateRiderStatus);

export default router;
