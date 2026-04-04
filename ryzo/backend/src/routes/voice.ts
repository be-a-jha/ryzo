import { Router } from 'express';
import { generateVoice } from '../controllers/voiceController';

const router = Router();

// POST /api/voice/generate — Generate voice audio
router.post('/generate', generateVoice);

export default router;
