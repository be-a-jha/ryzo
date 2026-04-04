import { Router } from 'express';
import { triggerMatch, getMatch, acceptMatch, declineMatch } from '../controllers/matchingController';

const router = Router();

// POST /api/matching/trigger — Trigger a new match
router.post('/trigger', triggerMatch);

// GET /api/matching/:id — Get match by ID
router.get('/:id', getMatch);

// POST /api/matching/:id/accept — Accept a match
router.post('/:id/accept', acceptMatch);

// POST /api/matching/:id/decline — Decline a match
router.post('/:id/decline', declineMatch);

export default router;
