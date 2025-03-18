import axios from "axios";

const baseURL = 'https://mojime-server.vercel.app/api';

export async function getEpisodeList(id: string) {
  const episodes = await axios.get(`${baseURL}/episode/list?animeId=${id}`);
  return episodes.data;
}

export async function getEpisodeSource(id: string) {
  const source = await axios.get(`${baseURL}/episode/sources?=${id}`);
  return source.data;
}

export async function getProxy(url: string) {
  const proxy = await axios.get(`${baseURL}/proxy?=${url}&rewrite=qualities`);
  return proxy.data;
}