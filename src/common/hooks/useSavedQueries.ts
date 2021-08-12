import { useCallback, useContext } from "react";
import { AppStateContext } from "../../core/AppStateProvider";
import { v4 as uuid } from "uuid";
import { SavedQuery } from "../../features/saved/Saved";

const MAX_SAVED_QUERIES = 25;
const MAX_CONTENT_SIZE = Infinity;

export function useSavedQueries(): {
  savedQueries: SavedQuery[];
  addSavedQuery: (query: Omit<SavedQuery, "id">) => void;
  editSavedQuery: (id: string, updatedQuery: Partial<SavedQuery>) => void;
  removeSavedQueries: (ids: string[]) => void;
} {
  const [
    {
      queries: { saved },
    },
    setAppState,
  ] = useContext(AppStateContext);

  const addSavedQuery = useCallback(
    (query: Omit<SavedQuery, "id">) => {
      setAppState((state) => {
        return {
          ...state,
          queries: {
            ...state.queries,
            saved: [
              {
                ...query,
                id: uuid(),
                query: query.query.slice(0, MAX_CONTENT_SIZE),
              },
              ...state.queries.saved.slice(0, MAX_SAVED_QUERIES - 1),
            ],
          },
        };
      });
    },
    [setAppState]
  );

  const editSavedQuery = useCallback(
    (id: string, updatedQuery: Partial<SavedQuery>) => {
      setAppState((state) => {
        return {
          ...state,
          queries: {
            ...state.queries,
            saved: [
              ...state.queries.saved.map((query) => {
                if (query.id !== id) return query;

                return {
                  ...query,
                  ...updatedQuery,
                };
              }),
            ],
          },
        };
      });
    },
    [setAppState]
  );

  const removeSavedQueries = useCallback(
    (ids: string[]) => {
      setAppState((state) => {
        return {
          ...state,
          queries: {
            ...state.queries,
            saved: state.queries.saved.filter(({ id }) => !ids.includes(id)),
          },
        };
      });
    },
    [setAppState]
  );

  return {
    savedQueries: saved,
    addSavedQuery,
    editSavedQuery,
    removeSavedQueries,
  };
}
