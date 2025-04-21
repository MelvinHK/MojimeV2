import VideoPlayer from "./VidstackPlayer/Vidstack";
import '../styles/animeId.css';
import BookmarkBtn from './BookmarkBtn';
import { FormEvent } from "react";
import { useAnime } from "./Providers/AnimeProvider";
import { useState, useRef, useEffect, CSSProperties } from "react";
import { IndexNavigation } from "./Providers/AnimeProvider";
import ErrorPage from './ErrorPage';
import { useHistory } from "./Providers/HistoryProvider";

function WatchLayout() {
  const {
    anime, episode, episodeUrl, currentIndex,
    handleNavigate, hasPrevious, hasNext,
    animeError, isFetchingAnime, provider
  } = useAnime();

  const { addHistory } = useHistory();

  const [episodeInputValue, setEpisodeInputValue] = useState(String(episode?.number ?? "?"));
  const episodeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!anime || !provider) return;
    addHistory({
      animeId: anime.id,
      title: anime.title,
      episodeIndex: currentIndex,
      provider: provider
    });
  }, [anime, currentIndex, provider]);

  useEffect(() => {
    if (!anime || !episode) return;
    setEpisodeInputValue(String(episode.number));
  }, [anime, episode]);

  const handleEpisodeInput = (e: FormEvent) => {
    e.preventDefault();
    if (anime?.episodes.some(episode => String(episode.number) === episodeInputValue)) {
      handleNavigate(Number(episodeInputValue));
    }
  }

  const episodeInputStyle: CSSProperties = {
    width: `${episodeInputValue.length + 1}ch`
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

  return anime && episodeUrl && (<>
    <div className='video-container'>
      <VideoPlayer m3u8URL={episodeUrl} />
    </div>
    <div className='anime-details-container'>
      <p>{anime.title}</p>
      <BookmarkBtn anime={anime} />
      <div className='flex a-center gap-1'>
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
            onBlur={() => setEpisodeInputValue(String(episode?.number))}
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
  </>)
}

export default WatchLayout