import { HiAnime, AnimeServers } from 'aniwatch';
import { Request, Response } from 'express';

const anime = new HiAnime.Scraper();

interface SourceQuery {
  id: string;
  server?: AnimeServers;
  category?: "sub" | "dub" | "raw";
}

export const getEpisodeSources = async (req: Request<{}, {}, {}, SourceQuery>, res: Response) => {
  try {
    const { id, server, category } = req.query;
    const sources = await anime.getEpisodeSources(id, server, category);
    res.json(sources);
  } catch (error) {
    console.log(error);
  }
}