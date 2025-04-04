const CACHE_VERSION = "1.0.0";
const CACHE_VERSION_KEY = "cacheVersion";

const storedVersion = localStorage.getItem(CACHE_VERSION_KEY);

if (storedVersion !== CACHE_VERSION) {
  localStorage.clear();
  localStorage.setItem(CACHE_VERSION_KEY, CACHE_VERSION);
}

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './styles/index.css'
import './styles/main.css'

import { QueryClient } from '@tanstack/react-query'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { PersistQueryClientProvider, removeOldestQuery } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'

import { compress, decompress } from 'lz-string'

import { routeTree } from './routeTree.gen'
import ErrorPage from './components/ErrorPage'

const router = createRouter({
  routeTree,
  defaultNotFoundComponent: () => <ErrorPage error={new Error("Page not found")} />
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      networkMode: "always"
    },
  },
});

const persister = createSyncStoragePersister({
  storage: window.localStorage,
  key: "offlineCache",
  serialize: data => compress(JSON.stringify(data)),
  deserialize: data => JSON.parse(decompress(data)),
  retry: removeOldestQuery
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: 1209600000 // 2 weeks
      }}
    >
      <RouterProvider router={router} />
    </PersistQueryClientProvider>
  </StrictMode>,
);