import { useParams, useNavigate } from '@tanstack/react-router';
import VideoPlayer from "./VidstackPlayer/Vidstack";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import getApiClient, { PROVIDERS } from '../lib/api/clientManager';
import { useState, createContext, useEffect, useMemo, CSSProperties, FormEvent, useRef } from 'react';
import { Anime, Episode } from '../models';
import { AxiosError } from 'axios';
import ErrorPage from './ErrorPage';
import '../styles/animeId.css';
import { KaiRoute } from '../routes/kai.$animeId';
import { PaheRoute } from '../routes/pahe.$animeId';

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
  handleNavigate: (type: IndexNavigation | number) => void;
  isFetchingEpisode: boolean;
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
  isFetchingEpisode: true,
  prefetchEpisode: (_selectedEpisode) => { },
});

interface AnimeProviderProps {
  Route: KaiRoute | PaheRoute,
  provider: PROVIDERS
}

function AnimeProvider({ Route, provider }: AnimeProviderProps) {
  const api = getApiClient(provider);
  const queryClient = useQueryClient();

  const { animeId } = useParams({ strict: false });
  const { ep: episodeParam } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: anime, error: animeError, isFetching: isFetchingAnime } = useQuery({
    queryKey: ['Anime', animeId],
    queryFn: async () => {
      if (animeId) {
        return await api.getAnime(animeId);
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

  const [episodeInputValue, setEpisodeInputValue] = useState(String(selectedEpisode?.number ?? "?"));
  const episodeInputRef = useRef<HTMLInputElement>(null);

  // Sync any state that is dependent on selectedEpisode.
  useEffect(() => {
    if (!anime || !selectedEpisode) return;
    setCurrentIndex(anime.episodes.findIndex(
      episode => String(episode.number) === String(selectedEpisode.number)
    ));
    setEpisodeInputValue(String(selectedEpisode.number));
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
      return await api.getEpisode(id ?? selectedEpisode.id);
    }
  }

  const { data: episodeURL, isFetching: isFetchingEpisode } = useQuery({
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

  useEffect(() => {
    if (anime && selectedEpisode)
      document.title = `${anime?.title} - Episode ${selectedEpisode?.number} | Mojime`
  }, [anime, selectedEpisode])

  const hasPrevious = useMemo(() => currentIndex > 0, [currentIndex]);
  const hasNext = useMemo(() => !anime || currentIndex < anime.episodes.length - 1, [anime, currentIndex]);

  const handleNavigate = (type: IndexNavigation | number) => {
    if (!anime) return;
    if (Object.values(IndexNavigation).includes(type as IndexNavigation)) {
      const newIndex = type === IndexNavigation.NEXT ? currentIndex + 1 : currentIndex - 1;
      navigate({ search: () => ({ ep: anime.episodes[newIndex].number }) });
    } else if (typeof type === "number") {
      navigate({ search: () => ({ ep: type }) });
    }
  }

  const handleEpisodeInput = (e: FormEvent) => {
    e.preventDefault();
    if (anime?.episodes.find(episode => String(episode.number) === episodeInputValue)) {
      handleNavigate(Number(episodeInputValue));
    }
  }

  if (animeError) {
    return <ErrorPage error={animeError} />;
  }

  if (anime?.episodes.length === 0) {
    return <ErrorPage error={new Error("Error: No episodes exist (yet?)")} />;
  }

  if (isFetchingAnime) {
    return <div className='home-container'>Loading Anime...</div>
  }

  const episodeInputStyle: CSSProperties = {
    width: `${episodeInputValue.length + 1}ch`
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
        isFetchingEpisode: isFetchingEpisode,
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
          <form
            onSubmit={handleEpisodeInput}
            onClick={() => episodeInputRef.current?.focus()}
          >
            <input
              ref={episodeInputRef}
              className="episode-input"
              style={episodeInputStyle}
              value={episodeInputValue}
              onChange={e => setEpisodeInputValue(e.target.value)}
              onBlur={() => setEpisodeInputValue(String(selectedEpisode?.number))}
              maxLength={10}
            />
            / {anime.totalEpisodes}
          </form>
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

export default AnimeProvider;