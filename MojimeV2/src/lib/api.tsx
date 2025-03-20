import axios from "axios";
import { SearchResult, Anime, Source } from "../models";

const baseURL = 'https://mojime-server.vercel.app/api';

export async function getSearch(query: string): Promise<SearchResult[]> {
  const results = await axios.get(`${baseURL}/search?query=${query}`);
  return results.data;
}

export async function getAnime(id: string): Promise<Anime> {
  const episodes = await axios.get(`${baseURL}/anime?animeId=${id}`);
  return episodes.data;
}

export async function getEpisode(id: string): Promise<Source> {
  const source = await axios.get(`${baseURL}/episode?episodeId=${id}`);
  return source.data;
}

export function getProxyURL(url: string) {
  return `${baseURL}/proxy?url=${url}&rewrite=qualities`;
}