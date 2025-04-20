/**
 * Returns megabyte-size of a specified local storage object.
 */
export function getLocalStorageItemSize(key: string) {
  const value = localStorage.getItem(key);
  return value === null ? 0 : new Blob([value]).size;
}

/**
 * Returns megabyte-size of all local storage objects.
 */
export function getTotalLocalStorageSize() {
  let bytes = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const item = localStorage.key(i);
    if (item) {
      bytes += getLocalStorageItemSize(item)
    }
  }
  return bytes;
}

export function formatToMB(bytes: number) {
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(5)} MB`;
}