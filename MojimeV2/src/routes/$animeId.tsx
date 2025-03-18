import { createFileRoute, useParams } from '@tanstack/react-router'
import VideoPlayer from "../components/VideoPlayer"
import { useQuery } from "@tanstack/react-query"
import { getEpisodeList, getEpisodeSource, proxySource } from "../lib/api"
import { useState } from 'react'

export const Route = createFileRoute('/$animeId')({
  component: $AnimeId,
})

function $AnimeId() {
  const { animeId } = useParams({ strict: false });
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: episodeList } = useQuery({
    queryKey: ['EpisodeList', animeId],
    queryFn: async () => {
      console.log('fetching episodeList')
      if (animeId) {
        const list = await getEpisodeList(animeId);
        console.log("list:", list)
        return list;
      }
    },
    placeholderData: episodeList => episodeList
  });

  const { data: episode } = useQuery({
    queryKey: ['Episode', currentIndex],
    queryFn: async () => {
      console.log('fetching episode source')
      if (episodeList) {
        const source = await getEpisodeSource(episodeList[currentIndex].id);
        const proxy = proxySource(source.url);
        console.log("source", proxy)
        return proxy;
      }
    },
    placeholderData: episode => episode,
    enabled: !!episodeList,
    staleTime: Infinity
  });

  // const getIndexByEpisodeNumber = (epNo: number | string) => {
  //   return !episodeList ? -1 :
  //     episodeList.episodes.findIndex((episode: any) => String(episode.number) === String(epNo));
  // }

  return episode && (<>
    <VideoPlayer
      m3u8URL={episode}
      episodeIndex={{ currentIndex, setCurrentIndex }}
    />
  </>)
}
