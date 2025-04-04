import axios from "axios";
import { SearchResult, Anime, Source } from "../models";

const baseURL = 'https://mojime-server.vercel.app/api';

export async function getSearch(query: string): Promise<SearchResult[]> {
  const results = await axios.get(`${baseURL}/kai/search?query=${query}`);
  return results.data;
}

export async function getAnime(id: string): Promise<Anime> {
  const episodes = await axios.get(`${baseURL}/kai/anime?animeId=${id}`);
  return episodes.data;
}

export async function getEpisode(id: string): Promise<Source> {
  const source = await axios.get(`${baseURL}/kai/episode?episodeId=${id}`);
  return source.data;
}

export function getProxyURL(url: string) {
  return `${baseURL}/kai/proxy?url=${url}&rewrite=qualities`;
}