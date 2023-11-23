import { useCallback, useState } from "react";
import { StacCollection } from "stac-ts";
import Api from "../api";
import { LoadingState, ApiError } from "../types";

type UseUpdateCollectionType = {
  update: (data: StacCollection) => Promise<StacCollection>;
  error?: ApiError;
  state: LoadingState;
}

function useUpdateCollection(): UseUpdateCollectionType {
  const [ error, setError ] = useState<ApiError>();
  const [ state, setState ] = useState<LoadingState>('IDLE');

  const update = useCallback((data: StacCollection) => {
    setState("LOADING");

    return Api.fetch(
      `${process.env.REACT_APP_STAC_API}/collections/`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      },
    )
      .catch((e) => setError(e))
      .finally(() => setState("IDLE"));
  }, [])

  return {
    update,
    error,
    state
  }
}

export default useUpdateCollection;
