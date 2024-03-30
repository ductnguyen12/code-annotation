import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { chooseDataset } from "../slices/datasetsSlice";
import { SnippetsState, loadDatasetSnippetsAsync, selectSnippetsState, setSnippets } from "../slices/snippetsSlice";

export const useDatasetSnippets = (datasetId: number | undefined): SnippetsState => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (datasetId) {
      dispatch(chooseDataset(datasetId));
      dispatch(loadDatasetSnippetsAsync(datasetId));
    } else {
      dispatch(chooseDataset(-1));
      dispatch(setSnippets([]));
    }
  }, [dispatch, datasetId]);

  return useAppSelector(selectSnippetsState);
}