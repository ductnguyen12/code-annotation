import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { DatasetsState, loadDatasetsAsync, selectDatasetsState } from "../slices/datasetsSlice";

export const useDatasets = (): DatasetsState => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(loadDatasetsAsync());
  }, [dispatch])

  return useAppSelector(selectDatasetsState);
}