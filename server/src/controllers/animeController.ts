import { HiAnime, AnimeServers } from 'aniwatch'; // Manually export AnimeServers type from node_modules
import { Request, Response } from 'express';

const anime = new HiAnime.Scraper();

interface SourceQuery {
  id: string;
  server?: AnimeServers;
  category?: "sub" | "dub" | "raw";
}

interface Track {
  file: string,
  label: string,
  kind: string,
  default: boolean
}

export const getEpisodeSources = async (req: Request<{}, {}, {}, SourceQuery>, res: Response) => {
  try {
    const { id, server, category } = req.query;
    const data: any = await anime.getEpisodeSources(id, server, category);
    res.json({
      source: data.sources[0].url,
      subtitles: data.tracks.find((track: Track) => track.label === 'English').file
    });
  } catch (error) {
    console.log(error);
  }
}