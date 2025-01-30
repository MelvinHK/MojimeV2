import express from 'express';
import { getEpisodeSources } from './controllers/animeController';

const router = express.Router();

router.get('/source', getEpisodeSources);

export default router;