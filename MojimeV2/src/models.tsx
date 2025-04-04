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