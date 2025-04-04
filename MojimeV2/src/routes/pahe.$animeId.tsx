import { createFileRoute } from '@tanstack/react-router'
import { AnimeSearchParams } from '../models'
import AnimeProvider from '../components/AnimeProvider';
import { PROVIDERS } from '../lib/api/clientManager';

export const Route = createFileRoute('/pahe/$animeId')({
  component: Pahe$AnimeId,
  validateSearch: () => ({}) as AnimeSearchParams
})

export type PaheRoute = typeof Route;

function Pahe$AnimeId() {
  return (
    <AnimeProvider Route={Route} provider={PROVIDERS.PAHE}/>
  )
}
