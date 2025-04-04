import axios from "axios";
import { SearchResult, Anime } from "../../models";
import { BASE_URL, PAHE_PARAM } from "./config";

export async function getSearch(query: string): Promise<SearchResult[]> {
  const results = await axios.get(`${BASE_URL}/${PAHE_PARAM}/search?query=${query}`);
  return results.data;
}

export async function getAnime(id: string): Promise<Anime> {
  const episodes = await axios.get(`${BASE_URL}/${PAHE_PARAM}/anime?animeId=${id}`);
  return episodes.data;
}

export async function getEpisode(id: string) {
  return `${BASE_URL}/${PAHE_PARAM}/episode?episodeId=${id}`;
}