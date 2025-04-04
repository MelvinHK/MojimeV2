import { createFileRoute } from '@tanstack/react-router'
import AnimeProvider from '../components/AnimeProvider';
import { PROVIDERS } from '../lib/api/clientManager';
import { AnimeSearchParams } from '../models';

export const Route = createFileRoute('/kai/$animeId')({
  component: Kai$AnimeId,
  validateSearch: () => ({}) as AnimeSearchParams
})

export type KaiRoute = typeof Route;

function Kai$AnimeId() {
  return (
    <AnimeProvider Route={Route} provider={PROVIDERS.KAI}/>
  )
}