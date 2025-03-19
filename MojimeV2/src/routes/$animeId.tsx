import { createFileRoute, useParams } from '@tanstack/react-router'
import VideoPlayer from "../components/VideoPlayer"
import { useQuery } from "@tanstack/react-query"
import { getAnime, getEpisode, proxySource } from "../lib/api"
import { useState } from 'react'

export const Route = createFileRoute('/$animeId')({
  component: $AnimeId,
})

function $AnimeId() {
  const { animeId } = useParams({ strict: false });
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: anime } = useQuery({
    queryKey: ['Anime', animeId],
    queryFn: async () => {
      if (animeId) {
        const list = await getAnime(animeId);
        return list;
      }
    },
    staleTime: 0,
    gcTime: Infinity
  });

  const { data: episode } = useQuery({
    queryKey: ['Episode', currentIndex],
    queryFn: async () => {
      if (anime) {
        const source = await getEpisode(anime.episodes[currentIndex].id);
        const proxy = proxySource(source.url);
        return proxy;
      }
    },
    placeholderData: episode => episode,
    enabled: !!anime,
    staleTime: Infinity,
    gcTime: 60 * 60 * 1000
  });

  // const getIndexByEpisodeNumber = (epNo: number | string) => {
  //   return !episodeList ? -1 :
  //     episodeList.episodes.findIndex((episode: any) => String(episode.number) === String(epNo));
  // }

  if (!anime || !episode) return;

  return (<>
    <VideoPlayer
      m3u8URL={episode}
      episodeIndex={{ currentIndex, setCurrentIndex }}
    />
    <p>{anime.title}</p>
    <div>{anime.episodes[currentIndex].number} / {anime.totalEpisodes}</div>
  </>)
}
