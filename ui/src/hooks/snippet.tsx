import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { chooseDataset } from "../slices/datasetsSlice";
import { SnippetsState, loadDatasetSnippetsAsync, selectSnippetsState } from "../slices/snippetsSlice";

export const useDatasetSnippets = (datasetId: number | undefined): SnippetsState => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (datasetId) {
      dispatch(chooseDataset(datasetId));
      dispatch(loadDatasetSnippetsAsync(datasetId));
    }
  }, [dispatch, datasetId])

  return useAppSelector(selectSnippetsState);
}