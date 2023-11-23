import { useCallback, useState } from "react";
import { StacCollection } from "stac-ts";

type UseUpdateCollectionType = {
  update: (data: StacCollection) => Promise<StacCollection>;
  error?: ApiError;
  state: LoadingState;
}

type GenericObject = {
  [key: string]: any  // eslint-disable-line @typescript-eslint/no-explicit-any
}

type ApiError = {
  detail?: GenericObject | string
  status: number,
  statusText: string
}
type LoadingState = 'IDLE' | 'LOADING';

function useUpdateCollection(): UseUpdateCollectionType {
  const [ error, setError ] = useState<ApiError>();
  const [ state, setState ] = useState<LoadingState>('IDLE');

  const update = useCallback((data: StacCollection) => {
    setState("LOADING");

    return fetch(`http://localhost:8081/collections/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(async (response) => {
        if (response.ok) {
          return response.json()
        }

        const { status, statusText } = response;
        const e: ApiError = {
          status,
          statusText
        };
        // Some STAC APIs return errors as JSON others as string. 
        // Clone the response so we can read the body as text if json fails. 
        const clone = response.clone();
        try {
          e.detail = await response.json(); 
        } catch (err) {
          e.detail = await clone.text();
        }
        setError(e);
      })
      .finally(() => setState("IDLE"));
  }, [])

  return {
    update,
    error,
    state
  }
}

export default useUpdateCollection;
