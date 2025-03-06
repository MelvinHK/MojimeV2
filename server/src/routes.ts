import express from 'express';
import { getEpisodeList, getEpisodeSource } from './controllers/animeController';

const router = express.Router();

router.get('/source', getEpisodeSource); // ?id=&server=&category=
router.get('/episodes', getEpisodeList); // ?id=

export default router;