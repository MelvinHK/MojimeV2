import { createFileRoute, useParams, useNavigate } from '@tanstack/react-router'
import VideoPlayer from "../components/VideoPlayer"
import { useQuery } from "@tanstack/react-query"
import { getAnime, getEpisode, getProxyURL } from "../lib/api"
import { useState, createContext, useEffect } from 'react'
import { Anime } from '../models'

interface AnimeSearchParams {
  ep: number
}

export const Route = createFileRoute('/$animeId')({
  component: $AnimeId,
  validateSearch: () => ({}) as AnimeSearchParams
})

interface AnimeContextType {
  anime: Anime | undefined;
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
}

export const AnimeContext = createContext<AnimeContextType>({
  anime: undefined,
  currentIndex: 0,
  setCurrentIndex: () => 0
});

function $AnimeId() {
  const { animeId } = useParams({ strict: false });
  const { ep } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: anime } = useQuery({
    queryKey: ['Anime', animeId],
    queryFn: async () => {
      if (animeId) {
        return await getAnime(animeId);
      }
    },
    staleTime: 0,
    gcTime: Infinity
  });

  const { data: episode } = useQuery({ // This is executing twice for some reason, and not due to React.StrictMode
    queryKey: ['Episode', ep, animeId],
    queryFn: async () => {
      if (anime) {
        const index = ep ? getIndexByEpisodeNumber(ep) : 0;
        const source = await getEpisode(anime.episodes[index].id);
        navigate({
          search: () => ({ ep: anime.episodes[index].number }),
          replace: !ep
        })
        return getProxyURL(source.url);
      }
    },
    placeholderData: episode => episode,
    enabled: !!anime,
    staleTime: Infinity,
    gcTime: 60 * 60 * 1000
  });

  const getIndexByEpisodeNumber = (epNo: number) => {
    return !anime?.episodes ? 0 :
      anime.episodes.findIndex((episode: any) => String(episode.number) === String(epNo));
  }

  useEffect(() => {
    if (!ep || !anime) return;
    setCurrentIndex(anime.episodes.findIndex(episode => episode.number === ep))
  }, [ep, anime])

  return anime && episode && (
    <AnimeContext.Provider
      value={{
        anime: anime,
        currentIndex: currentIndex,
        setCurrentIndex: setCurrentIndex
      }}
    >
      <VideoPlayer m3u8URL={episode} />
      <p>{anime.title}</p>
      <div>{anime.episodes[currentIndex].number} / {anime.totalEpisodes}</div>
    </AnimeContext.Provider>
  )
}
