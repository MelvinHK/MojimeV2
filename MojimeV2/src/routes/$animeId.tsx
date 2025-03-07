import { createFileRoute, useParams } from '@tanstack/react-router'
import VideoPlayer from "../components/VideoPlayer"
import { useQuery } from "@tanstack/react-query"
import { getEpisodeList, getEpisodeSourceByID } from "../lib/api"
import { useState } from 'react'
import { Episode } from '../../../server/src/models/anime'

export const Route = createFileRoute('/$animeId')({
  component: $AnimeId,
})

function $AnimeId() {
  const { animeId } = useParams({ strict: false });
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: episodeList } = useQuery({
    queryKey: ['EpisodeList', animeId],
    queryFn: () => {
      console.log('fetching episodeList')
      if (animeId)
        return getEpisodeList(animeId)
    },
    placeholderData: episodeList => episodeList
  });

  const { data: episode } = useQuery({
    queryKey: ['Episode', currentIndex],
    queryFn: () => {
      console.log('fetching episode source')
      if (episodeList)
        return getEpisodeSourceByID(episodeList.episodes[currentIndex].id)
    },
    placeholderData: episode => episode,
    enabled: !!episodeList?.episodes?.length,
  });

  const getIndexByEpisodeNumber = (epNo: number | string) => {
    return !episodeList ? -1 :
      episodeList.episodes.findIndex((episode: Episode) => String(episode.number) === String(epNo));
  }

  return episode && (<>
    <VideoPlayer
      key={episode.subtitles}
      m3u8URL={episode.source}
      vttURL={episode.subtitles}
      episodeIndex={{ currentIndex, setCurrentIndex }}
    />
  </>)
}
