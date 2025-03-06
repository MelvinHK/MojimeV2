/**
 * The returned data structure of some functions in aniwatch do not match their declared type,
 * or, some useful types weren't exported by the author.
 * 
 * This module adds/corrects those types.
 */

declare module 'aniwatch-fixed' {
  type AnimeServers = "hd-1" | "hd-2" | "megacloud" | "streamsb" | "streamtape";

  interface Track {
    file: string,
    label: string,
    kind: string,
    default: boolean
  }

  interface Source {
    url: string,
    type: string
  }

  interface IntroOutro {
    start: number,
    end: number
  }

  interface ScrapedAnimeEpisodesSources {
    tracks: Track[],
    intro: IntroOutro,
    outro: IntroOutro,
    sources: Source[],
    anilistID: number | null,
    malID: number | null
  }
}