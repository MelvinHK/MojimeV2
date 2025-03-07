import { Source, Episodes } from '../../../server/src/models/anime';

import axios from "axios";

const baseURL = 'http://localhost:5000/api';

export async function getEpisodeSourceByID(id: string, server?: string, category?: string): Promise<Source> {
  const params = new URLSearchParams();
  params.append('id', id);
  server && params.append('server', server);
  category && params.append('category', category);

  const source = await axios.get(`${baseURL}/source?${params.toString()}`);
  return source.data;
}

export async function getEpisodeList(id: string): Promise<Episodes> {
  const episodes = await axios.get(`${baseURL}/episodes?id=${id}`);
  return episodes.data;
}

export async function getEpisodeListAndSource(
  animeId: string,
  epId?: string,
  epNumber?: number,
  epIndex?: number,
  server?: string,
  category?: string
): Promise<Episodes & Source> {
  const providedEpQuery = [epId, epNumber, epIndex].filter((v) => v !== undefined);

  if (providedEpQuery.length !== 1) {
    throw new Error("Only one of either 'epId', 'epNumber', or 'epIndex' must be provided.");
  }

  const params = new URLSearchParams();
  params.append('animeId', animeId);
  epId && params.append('epId', epId);
  epNumber && params.append('epNumber', String(epNumber));
  epIndex && params.append('epIndex', String(epIndex));
  server && params.append('server', server);
  category && params.append('category', category);

  const listAndSource = await axios.get(`${baseURL}/episodesAndSource?${params.toString()}`);
  return listAndSource.data;
}

export async function getVtt(url: string) {
  const response = await axios.get(url, { responseType: 'text' })
  const vttContent = response.data;
  const blob = new Blob([vttContent], { type: 'text/vtt' });
  return { content: vttContent, url: URL.createObjectURL(blob) };
}