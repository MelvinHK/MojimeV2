import express from 'express';
import { getEpisodeList, getEpisodeSourceByID, getEpisodeListAndSource } from './controllers/animeController';

const router = express.Router();

router.get('/source', getEpisodeSourceByID); // ?id=&server=&category=
router.get('/episodes', getEpisodeList); // ?id=
router.get('/episodesAndSource', getEpisodeListAndSource); // ?animeId=&epId&epIndex=&epNumber=

export default router;