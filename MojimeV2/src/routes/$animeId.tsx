import { createFileRoute, useParams, useNavigate } from '@tanstack/react-router'
import VideoPlayer from "../components/VideoPlayer"
import { useQuery } from "@tanstack/react-query"
import { getAnime, getEpisode, getProxyURL } from "../lib/api"
import { useState, createContext, useEffect, useMemo } from 'react'
import { Anime, Episode } from '../models'

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
  episode: Episode | undefined;
}

export const AnimeContext = createContext<AnimeContextType>({
  anime: undefined,
  currentIndex: 0,
  setCurrentIndex: () => 0,
  episode: undefined
});

function $AnimeId() {
  const { animeId } = useParams({ strict: false });
  const { ep: episodeParam } = Route.useSearch();
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

  // Derive selected episode from URL param.
  // If there's no 'ep' param, default to the first episode.
  const selectedEpisode = useMemo(() => {
    if (!anime) return undefined;
    return anime.episodes.find(episode => episode.number === episodeParam)
      || anime.episodes[0];
  }, [anime, episodeParam]);

  // Sync currentIndex with the index of selected episode.
  useEffect(() => {
    if (!anime || !selectedEpisode) return;
    setCurrentIndex(anime.episodes.findIndex(
      episode => String(episode.number) === String(selectedEpisode.number)
    ));
  }, [anime, selectedEpisode]);

  // If no ep param is present, update the URL once with the default episode.
  useEffect(() => {
    if (anime && !episodeParam && selectedEpisode) {
      navigate({
        search: () => ({ ep: selectedEpisode.number }),
        replace: true
      });
    }
  }, [anime, episodeParam, selectedEpisode, navigate]);

  const { data: episodeURL } = useQuery({
    queryKey: ['Episode', selectedEpisode?.number, animeId],
    queryFn: async () => {
      if (selectedEpisode) {
        const source = await getEpisode(selectedEpisode.id);
        return getProxyURL(source.url);
      }
    },
    enabled: !!anime && !!selectedEpisode,
    placeholderData: episodeURL => episodeURL,
    staleTime: Infinity,
    gcTime: 60 * 60 * 1000
  });

  return anime && episodeURL && (
    <AnimeContext.Provider
      value={{
        anime: anime,
        currentIndex: currentIndex,
        setCurrentIndex: setCurrentIndex,
        episode: selectedEpisode
      }}
    >
      <VideoPlayer m3u8URL={episodeURL} />
      <p>{anime.title}</p>
      <div>{anime.episodes[currentIndex].number} / {anime.totalEpisodes}</div>
    </AnimeContext.Provider>
  )
}
