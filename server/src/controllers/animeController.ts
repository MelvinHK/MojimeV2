import { HiAnime } from 'aniwatch';
import { ScrapedAnimeEpisodesSources } from 'aniwatch-fixed';
import { Episode, Episodes, Source, SourceQuery } from '../models/api';
import { Request, Response } from 'express';

const anime = new HiAnime.Scraper();

export const getEpisodeSource = async (req: Request<{}, {}, {}, SourceQuery>, res: Response) => {
  try {
    const { id, server, category } = req.query;
    var data = await anime.getEpisodeSources(id, server, category) as unknown as ScrapedAnimeEpisodesSources;

    const source: Source = {
      source: data.sources[0].url,
      subtitles: data.tracks.find((track) => track.label === 'English')?.file
    }

    res.json(source);
  } catch (error) {
    console.log(error);
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

    res.json(episodes);
  } catch (error) {
    console.log(error);
  }
}