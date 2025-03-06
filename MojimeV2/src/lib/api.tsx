import { Source, Episodes } from '../../../server/src/models/api';

import axios from "axios";

const baseURL = 'http://localhost:5000/api';

export async function getEpisodeSource(id: string, server?: string, category?: string): Promise<Source> {
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