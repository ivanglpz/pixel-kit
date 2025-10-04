import {
  QueryObserverResult,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";

// Utilidad para cache en localStorage con TTL
type CacheData<T> = {
  data: T;
  timestamp: number;
};

const setCache = <T>(key: string, data: T, ttl: number): void => {
  const cache: CacheData<T> = { data, timestamp: Date.now() + ttl };
  localStorage.setItem(key, JSON.stringify(cache));
};

const getCache = <T>(key: string): T | null => {
  const item = localStorage.getItem(key);
  if (!item) return null;

  const cache: CacheData<T> = JSON.parse(item);
  if (Date.now() > cache.timestamp) {
    localStorage.removeItem(key);
    return null;
  }
  return cache.data;
};

// Props extendidas con cacheTime
type CachedQueryOptions<
  TQueryFnData,
  TError,
  TData,
  TQueryKey extends readonly unknown[],
> = Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, "queryFn"> & {
  queryFn: (ctx?: {
    queryKey: TQueryKey;
    signal?: AbortSignal;
  }) => Promise<TQueryFnData>;
  cacheTime?: number; // TTL en milisegundos para localStorage
};

// Hook extendido
export const useCachedQuery = <
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends readonly unknown[] = readonly unknown[],
>(
  options: CachedQueryOptions<TQueryFnData, TError, TData, TQueryKey>
): UseQueryResult<TData, TError> & {
  refetch: () => Promise<QueryObserverResult<TData, TError>>;
} => {
  const { queryKey, queryFn, cacheTime = 0, ...rest } = options;
  const key = JSON.stringify(queryKey);

  const Query = useQuery<TQueryFnData, TError, TData, TQueryKey>({
    queryKey,
    queryFn: async (ctx) => {
      if (cacheTime > 0) {
        const cached = getCache<TQueryFnData>(key);
        if (cached) return cached;
      }

      const data = await queryFn(ctx);
      if (cacheTime > 0) {
        setCache(key, data, cacheTime);
      }
      return data;
    },
    ...rest,
  });

  const refetch = async (): Promise<QueryObserverResult<TData, TError>> => {
    const data = await queryFn(); // se llama sin ctx
    if (cacheTime > 0) {
      setCache(key, data, cacheTime);
    }
    return Query.refetch(); // llama también al refetch original de react-query
  };

  return { ...Query, refetch };
};
