import { useCallback, useContext } from "react";
import { AppStateContext } from "../../core/AppStateProvider";
import { RecentQuery } from "../../features/recent/Recent";

const MAX_RECENT_QUERIES = 25;
const MAX_CONTENT_SIZE = 25;

export function useRecentQueries(): {
  recentQueries: RecentQuery[];
  addRecentQuery: (query: RecentQuery) => void;
  removeRecentQueries: (ids: number[]) => void;
} {
  const [
    {
      queries: { recent },
    },
    setAppState,
  ] = useContext(AppStateContext);

  const addRecentQuery = useCallback(
    (query: RecentQuery) => {
      setAppState((state) => {
        return {
          ...state,
          queries: {
            ...state.queries,
            recent: [
              { ...query, query: query.query.slice(0, MAX_CONTENT_SIZE) },
              ...state.queries.recent.slice(0, MAX_RECENT_QUERIES - 1),
            ],
          },
        };
      });
    },
    [setAppState]
  );

  const removeRecentQueries = useCallback(
    (indexes: number[]) => {
      setAppState((state) => {
        return {
          ...state,
          queries: {
            ...state.queries,
            recent: state.queries.recent.filter((_, i) => !indexes.includes(i)),
          },
        };
      });
    },
    [setAppState]
  );

  return {
    recentQueries: recent,
    addRecentQuery,
    removeRecentQueries,
  };
}
