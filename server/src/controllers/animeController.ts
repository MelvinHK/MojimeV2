import { HiAnime, HiAnimeError } from 'aniwatch';
import { SourceQuery } from '../models/aniwatch/aniwatchQueries';
import { ScrapedAnimeEpisodesSources } from 'aniwatch-fixed';
import { Episode, Episodes, Source } from '../models/anime';
import { Request, Response } from 'express';

const anime = new HiAnime.Scraper();

function handleError(error: any, res: Response) {
  console.error(error);
  if (error instanceof HiAnimeError) {
    return res.status(error.status).json({ error: error.message });
  }
  return res.status(500).json({ error: `Internal server error: ${error.message}` });
}

export const getEpisodeSourceByID = async (req: Request<{}, {}, {}, SourceQuery>, res: Response) => {
  try {
    const { id, server, category } = req.query;
    const data = await anime.getEpisodeSources(id, server, category) as unknown as ScrapedAnimeEpisodesSources;

    const source: Source = {
      source: data.sources[0].url,
      subtitles: data.tracks.find(track => track.label === 'English')?.file
    }

    return res.json(source);
  } catch (error: any) {
    handleError(error, res);
  }
}

export const getEpisodeList = async (req: Request<{}, {}, {}, { id: string }>, res: Response) => {
  try {
    const { id } = req.query;
    const data = await anime.getEpisodes(id);

    const episodes: Episodes = {
      total: data.totalEpisodes,
      episodes: data.episodes.map((episode: any): Episode => {
        return {
          number: episode.number,
          id: episode.episodeId
        }
      })
    }

    return res.json(episodes);
  } catch (error: any) {
    handleError(error, res);
  }
}