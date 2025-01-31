import VideoPlayer from "./components/VideoPlayer"
import { useQuery } from "@tanstack/react-query"
import { getEpisodeSources } from "./api"

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
      <VideoPlayer source={data.sources[0].url} />
    </>
  )
}

export default App
