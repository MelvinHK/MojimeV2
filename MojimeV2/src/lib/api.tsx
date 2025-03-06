import axios from "axios";

const baseURL = 'http://localhost:5000/api';

export async function getEpisodeSource(id: string, server?: string, category?: string) {
  const params = new URLSearchParams();
  params.append('id', id);
  server && params.append('server', server);
  category && params.append('category', category);

  const source = await axios.get(`${baseURL}/source?${params.toString()}`);
  console.log(source.data);
  return source.data;
}