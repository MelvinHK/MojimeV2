import VideoPlayer from "./components/VideoPlayer"
import { useQuery } from "@tanstack/react-query"
import { getEpisodeSources } from "./api"
import SearchBar from "./components/SearchBar";

function App() {
  const { data, status, error } = useQuery({
    queryKey: ['sources'],
    queryFn: () => getEpisodeSources("steinsgate-3?ep=230"),
  })

  if (status === 'pending') {
    console.log('loading...');
    return;
  }

  if (status === 'error') {
    console.log(error);
    return;
  }

  return (
    <>
      <SearchBar />
      <VideoPlayer source={data.source} subtitles={data.subtitles} />
    </>
  )
}

export default App
