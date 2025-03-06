import { AnimeServers } from "aniwatch-fixed";

export interface SourceQuery {
  id: string;
  server?: AnimeServers;
  category?: "sub" | "dub" | "raw";
}

export interface Source {
  source: string,
  subtitles?: string
}

export interface Episode {
  number: number | string,
  id: string
}

export interface Episodes {
  total: number,
  episodes: Episode[]
}