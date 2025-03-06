import { AnimeServers } from "aniwatch-fixed";

export type Category = "sub" | "dub" | "raw";

export interface SourceQuery {
  id: string;
  server?: AnimeServers;
  category?: Category;
}

export interface EpisodeListQuery {
  animeId: string
}

export type EpisodeListAndSourceQuery = EpisodeListQuery & (
  | { epId: string; epNumber?: never; epIndex?: never }
  | { epId?: never; epNumber: number; epIndex?: never }
  | { epId?: never; epNumber?: never; epIndex: number }
) & {
  server?: AnimeServers;
  category?: Category
};
