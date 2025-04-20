import { createFileRoute } from '@tanstack/react-router'
import { AnimeSearchParams } from '../models'
import { AnimeProvider } from '../components/Providers/AnimeProvider';
import { PROVIDERS } from '../lib/api/clientManager';
import WatchLayout from '../components/WatchLayout';

export const Route = createFileRoute('/pahe/$animeId')({
  component: Pahe$AnimeId,
  validateSearch: () => ({}) as AnimeSearchParams
})

export type PaheRoute = typeof Route;

function Pahe$AnimeId() {
  return (
    <AnimeProvider Route={Route} provider={PROVIDERS.PAHE}>
      <WatchLayout />
    </AnimeProvider>
  )
}
