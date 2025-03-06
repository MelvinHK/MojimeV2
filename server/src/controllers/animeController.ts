import { HiAnime, HiAnimeError } from 'aniwatch';
import { SourceQuery, EpisodeListAndSourceQuery } from '../models/aniwatchQueries';
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

const validateEpisodeQuery = (query: EpisodeListAndSourceQuery) => {
  const { epId, epNumber, epIndex } = query;
  const provided = [epId, epNumber, epIndex].filter((v) => v !== undefined);

  if (provided.length !== 1) {
    throw new Error("Only one of either 'epId', 'epNumber', or 'epIndex' must be provided.");
  }
};

/** Removes a round trip by the client if they're waterfall-requesting an episode-list and source. */
export const getEpisodeListAndSource = async (req: Request<{}, {}, {}, EpisodeListAndSourceQuery>, res: Response) => {
  try {
    const { animeId, epId, epNumber, epIndex, server, category } = req.query;
    validateEpisodeQuery(req.query);

    const list = await anime.getEpisodes(animeId);

    const episodes: Episodes = {
      total: list.totalEpisodes,
      episodes: list.episodes.map((episode: any, index): Episode => {
        return {
          number: episode.number,
          id: episode.episodeId
        }
      })
    }

    const matchingEpId = epId ?? episodes.episodes.find((episode, index) => (index === epIndex || episode.number === epNumber))?.id ?? "get404ed";

    const data = await anime.getEpisodeSources(matchingEpId, server, category) as unknown as ScrapedAnimeEpisodesSources;

    const source: Source = {
      source: data.sources[0].url,
      subtitles: data.tracks.find(track => track.label === 'English')?.file
    }

    return res.json({ ...episodes, ...source });
  } catch (error: any) {
    handleError(error, res);
  }
}