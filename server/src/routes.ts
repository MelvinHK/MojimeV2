import express from 'express';
import { getEpisodeList, getEpisodeSourceByID } from './controllers/animeController';

const router = express.Router();

router.get('/source', getEpisodeSourceByID); // ?id=&server=&category=
router.get('/episodes', getEpisodeList); // ?id=

export default router;