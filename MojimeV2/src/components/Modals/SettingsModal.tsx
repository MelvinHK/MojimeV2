import { useState, useEffect, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { getLocalStorageItemSize, formatToMB } from "../../lib/helpers/getLocalStorageSize";
import { OFFLINE_CACHE_KEY } from "../../main";

function SettingsModal() {
  const { offlineCacheSize, clearOfflineCache } = useOfflineCache();

  return (
    <div className="flex col gap-0p5">
      <div className="flex">
        Cache Size: ~{formatToMB(offlineCacheSize)}
        <span className="ml-auto">
          {"[ "}<button className="transparent-btn" onClick={clearOfflineCache}>Clear</button>{" ]"}
        </span>
      </div>
      <div className="bright-gray">
        File size of cached requests, e.g. search, episodes; used to quickly load previously requested content.
      </div>
    </div>
  )
}

export default SettingsModal;

const useOfflineCache = () => {
  const [offlineCache, setOfflineCache] = useState(() =>
    localStorage.getItem(OFFLINE_CACHE_KEY)
  );

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === OFFLINE_CACHE_KEY) {
        setOfflineCache(e.newValue);
      }
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event.type === 'updated') {
        setOfflineCache(localStorage.getItem(OFFLINE_CACHE_KEY));
      }
    });

    return () => unsubscribe();
  }, []);

  const offlineCacheSize = useMemo(() =>
    getLocalStorageItemSize(OFFLINE_CACHE_KEY), [offlineCache]
  );

  const clearOfflineCache = () => {
    localStorage.removeItem(OFFLINE_CACHE_KEY);
    setOfflineCache(null);
  }

  return { offlineCacheSize, clearOfflineCache }
}