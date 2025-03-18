import axios from "axios";

const baseURL = 'https://mojime-server.vercel.app/api';

export async function getEpisodeList(id: string) {
  const episodes = await axios.get(`${baseURL}/episode/list?animeId=${id}`);
  return episodes.data;
}

export async function getEpisodeSource(id: string) {
  const source = await axios.get(`${baseURL}/episode/sources?episodeId=${id}`);
  return source.data;
}

export function proxySource(url: string) {
  return `${baseURL}/proxy?url=${url}&rewrite=qualities`;
}