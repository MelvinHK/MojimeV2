import { createFileRoute } from '@tanstack/react-router'
import VideoPlayer from "../components/VideoPlayer"
import { useQuery } from "@tanstack/react-query"
import { getEpisodeSources } from "../lib/api"

export const Route = createFileRoute('/$animeId')({
  component: $AnimeId,
})

function $AnimeId() {
  const { data, status, error } = useQuery({
    queryKey: ['sources'],
    queryFn: () => getEpisodeSources("bocchi-the-rock-17479?ep=95538"),
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
      <VideoPlayer source={data.source} subtitles={data.subtitles} />
  )
}
