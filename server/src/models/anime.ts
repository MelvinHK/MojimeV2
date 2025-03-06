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