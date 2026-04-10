const cache = new Map();

export const setCache = (key, value, ttl = null) => {
  const expiry = ttl ? Date.now() + ttl : null;

  cache.set(key, {
    value,
    expiry,
  });
};

export const getCache = (key) => {
  const entry = cache.get(key);

  if (!entry) return null;

  if (entry.expiry && Date.now() > entry.expiry) {
    cache.delete(key);
    return null;
  }

  return entry.value;
};

export const clearCache = () => {
  cache.clear();
};