import { useCallback, useEffect, useState } from "react";

/**
 * Runs an async fetcher on mount (and whenever `deps` changes), exposing
 * { data, error, isLoading, reload }. Keeping this generic avoids re-writing
 * the same try/catch/loading dance in every dashboard page.
 */
export function useApi(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
    } catch (e) {
      setError(e.message || "Erreur lors du chargement des données.");
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    load();
  }, [load]);

  return { data, error, isLoading, reload: load, setData };
}

/**
 * For imperative actions (submit a form, call an endpoint on click) rather
 * than data fetched on mount. Returns [run, { isLoading, error }].
 */
export function useAction(action) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const run = useCallback(
    async (...args) => {
      setIsLoading(true);
      setError(null);
      try {
        return await action(...args);
      } catch (e) {
        setError(e.message || "Une erreur est survenue.");
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [action]
  );

  return [run, { isLoading, error }];
}
