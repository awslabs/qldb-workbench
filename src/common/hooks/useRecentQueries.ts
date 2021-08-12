import { useCallback, useContext } from "react";
import { AppStateContext } from "../../core/AppStateProvider";
import { RecentQuery } from "../../features/recent/Recent";
import { v4 as uuid } from "uuid";

const MAX_RECENT_QUERIES = 25;
const MAX_CONTENT_SIZE = Infinity;

export function useRecentQueries(): {
  recentQueries: RecentQuery[];
  addRecentQuery: (query: Omit<RecentQuery, "id">) => void;
  removeRecentQueries: (ids: string[]) => void;
} {
  const [
    {
      queries: { recent },
    },
    setAppState,
  ] = useContext(AppStateContext);

  const addRecentQuery = useCallback(
    (query: Omit<RecentQuery, "id">) => {
      setAppState((state) => {
        return {
          ...state,
          queries: {
            ...state.queries,
            recent: [
              {
                ...query,
                id: uuid(),
                query: query.query.slice(0, MAX_CONTENT_SIZE),
              },
              ...state.queries.recent.slice(0, MAX_RECENT_QUERIES - 1),
            ],
          },
        };
      });
    },
    [setAppState]
  );

  const removeRecentQueries = useCallback(
    (ids: string[]) => {
      setAppState((state) => {
        return {
          ...state,
          queries: {
            ...state.queries,
            recent: state.queries.recent.filter(({ id }) => !ids.includes(id)),
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
