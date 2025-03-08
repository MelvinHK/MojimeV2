import { AnimeServers, Category } from "aniwatch-fixed";

export interface SourceQuery {
  id: string;
  server?: AnimeServers;
  category?: Category;
}