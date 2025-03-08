/**
 * The returned data structure of some functions in aniwatch do not match their declared type,
 * or, some useful types weren't exported by the author.
 * 
 * This module adds/corrects those types.
 */

declare module 'aniwatch-fixed' {
  type AnimeServers = "hd-1" | "hd-2" | "megacloud" | "streamsb" | "streamtape";

  type Category = "sub" | "dub" | "raw";

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

  interface Segment {
    start: number,
    end: number
  }

  interface ScrapedAnimeEpisodesSources {
    tracks: Track[],
    intro: Segment,
    outro: Segment,
    sources: Source[],
    anilistID: number | null,
    malID: number | null
  }
}