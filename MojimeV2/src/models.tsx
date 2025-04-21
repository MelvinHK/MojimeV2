import { PROVIDERS } from "./lib/api/clientManager"

export interface SearchResult {
  id: string,
  title: string
}

export interface Anime {
  id: string,
  title: string,
  totalEpisodes: number,
  episodes: Episode[]
}

export interface Episode {
  id: string,
  number: number
}

export interface AnimeSearchParams {
  ep: number
}

export interface Bookmark {
  animeId: string,
  title: string,
  provider: PROVIDERS | undefined
}

export interface History {
  animeId: string,
  title: string,
  /** Most recently watched episode's index. */
  episodeIndex: number,
  provider: PROVIDERS | undefined
}