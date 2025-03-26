import { createFileRoute, useParams, useNavigate } from '@tanstack/react-router'
import VideoPlayer from "../components/VideoPlayer"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { getAnime, getEpisode, getProxyURL } from "../lib/api"
import { useState, createContext, useEffect, useMemo } from 'react'
import { Anime, Episode } from '../models'
import { AxiosError } from 'axios'
import ErrorPage from '../components/ErrorPage'

interface AnimeSearchParams {
  ep: number
}

export const Route = createFileRoute('/$animeId')({
  component: $AnimeId,
  validateSearch: () => ({}) as AnimeSearchParams
})

export enum IndexNavigation {
  NEXT = "next",
  PREVIOUS = "previous"
};

interface AnimeContextType {
  anime: Anime | undefined;
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  episode: Episode | undefined;
  hasNext: boolean;
  hasPrevious: boolean;
  handleNavigate: (type: IndexNavigation) => void;
  isFetching: boolean;
  prefetchEpisode: (selectedEpisode: Episode) => void;
}

export const AnimeContext = createContext<AnimeContextType>({
  anime: undefined,
  currentIndex: 0,
  setCurrentIndex: () => 0,
  episode: undefined,
  hasNext: false,
  hasPrevious: false,
  handleNavigate: (_type) => { },
  isFetching: true,
  prefetchEpisode: (_selectedEpisode ) => { },
});

function $AnimeId() {
  const queryClient = useQueryClient();

  const { animeId } = useParams({ strict: false });
  const { ep: episodeParam } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: anime, error: animeError } = useQuery({
    queryKey: ['Anime', animeId],
    queryFn: async () => {
      if (animeId) {
        return await getAnime(animeId);
      }
    },
    staleTime: 0,
    gcTime: 1209600000, // 2 weeks
    retry: (failureCount, error) => {
      return (error as AxiosError)?.status !== 404 && failureCount < 3;
    }
  });

  // Derive selected episode from URL param.
  // If there's no ep param or no match is found, default to the first episode.
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

  // Update URL ep param to be selectedEpisode.number if
  // ep param didn't exist/match.
  useEffect(() => {
    if (!anime || !selectedEpisode) return;
    if (selectedEpisode.number !== episodeParam) {
      navigate({
        search: () => ({ ep: selectedEpisode.number }),
        replace: true
      });
    }
  }, [anime, episodeParam, selectedEpisode, navigate]);

  const fetchEpisode = async (id?: string) => {
    if (selectedEpisode) {
      const source = await getEpisode(id ?? selectedEpisode.id);
      return getProxyURL(source.url);
    }
  }

  const { data: episodeURL, isFetching } = useQuery({
    queryKey: ['Episode', selectedEpisode?.number, animeId],
    queryFn: () => fetchEpisode(),
    enabled: !!anime && !!selectedEpisode,
    placeholderData: (episodeURL) => episodeURL,
    staleTime: Infinity,
    gcTime: 60 * 60 * 1000
  });

  const prefetchEpisode = (episode: Episode) => {
    queryClient.prefetchQuery({
      queryKey: ['Episode', episode?.number, animeId],
      queryFn: () => fetchEpisode(episode.id),
      staleTime: Infinity,
      gcTime: 60 * 60 * 1000
    })
  }

  const hasPrevious = useMemo(() => currentIndex > 0, [currentIndex]);
  const hasNext = useMemo(() => !anime || currentIndex < anime.episodes.length - 1, [anime, currentIndex]);

  const handleNavigate = (type: IndexNavigation) => {
    if (!anime) return;
    const newIndex = type === IndexNavigation.NEXT ? currentIndex + 1 : currentIndex - 1;
    navigate({ search: () => ({ ep: anime.episodes[newIndex].number }) });
  }

  if (animeError) {
    return <ErrorPage error={animeError} />;
  }

  if (anime?.episodes.length === 0) {
    return <ErrorPage error={new Error("Error: No episodes exist (yet?)")} />;
  }

  return anime && episodeURL && (
    <AnimeContext.Provider
      value={{
        anime: anime,
        currentIndex: currentIndex,
        setCurrentIndex: setCurrentIndex,
        episode: selectedEpisode,
        hasNext: hasNext,
        hasPrevious: hasPrevious,
        handleNavigate: handleNavigate,
        isFetching: isFetching,
        prefetchEpisode: prefetchEpisode,
      }}
    >
      <div className='video-container'>
        <VideoPlayer m3u8URL={episodeURL} />
      </div>
      <div className='anime-details-container'>
        <p>{anime.title}</p>
        <div className='flex gap-1 a-center'>
          <button
            className='btn'
            onClick={() => handleNavigate(IndexNavigation.PREVIOUS)}
            disabled={!hasPrevious}
          >
            Prev
          </button>
          <div>
            {anime.episodes[currentIndex].number} / {anime.totalEpisodes}
          </div>
          <button
            className='btn'
            onClick={() => handleNavigate(IndexNavigation.NEXT)}
            disabled={!hasNext}
          >
            Next
          </button>
        </div>
      </div>
    </AnimeContext.Provider>
  )
}