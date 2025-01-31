import express from 'express';
import { getEpisodeSources } from './controllers/animeController';

const router = express.Router();

router.get('/sources', getEpisodeSources);

export default router;