import axios from "axios";

const baseURL = 'http://localhost:5000/api';

export async function getEpisodeSources(id: string, server?: string, category?: string) {
  const params = new URLSearchParams();
  params.append('id', id);
  server && params.append('server', server);
  category && params.append('category', category);

  const sources = await axios.get(`${baseURL}/sources?${params.toString()}`);
  console.log(sources.data);
  return sources.data;
}