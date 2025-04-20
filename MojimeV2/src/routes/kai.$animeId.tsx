import { createFileRoute } from '@tanstack/react-router'
import { AnimeProvider } from '../components/Providers/AnimeProvider';
import { PROVIDERS } from '../lib/api/clientManager';
import { AnimeSearchParams } from '../models';
import WatchLayout from '../components/WatchLayout';

export const Route = createFileRoute('/kai/$animeId')({
  component: Kai$AnimeId,
  validateSearch: () => ({}) as AnimeSearchParams
})

export type KaiRoute = typeof Route;

function Kai$AnimeId() {
  return (
    <AnimeProvider Route={Route} provider={PROVIDERS.KAI}>
      <WatchLayout />
    </AnimeProvider>
  )
}