import axios from "axios";
import { SearchResult, Anime } from "../../models";
import { BASE_URL, KAI_PARAM } from "./config";

export async function getSearch(query: string): Promise<SearchResult[]> {
  const results = await axios.get(`${BASE_URL}/${KAI_PARAM}/search?query=${query}`);
  return results.data;
}

export async function getAnime(id: string): Promise<Anime> {
  const episodes = await axios.get(`${BASE_URL}/${KAI_PARAM}/anime?animeId=${id}`);
  return episodes.data;
}

export async function getEpisode(id: string) {
  const source = await axios.get(`${BASE_URL}/${KAI_PARAM}/episode?episodeId=${id}`);
  return proxy(source.data.url);
}

export function proxy(url: string) {
  return `${BASE_URL}/${KAI_PARAM}/proxy?url=${url}&rewrite=qualities`;
}