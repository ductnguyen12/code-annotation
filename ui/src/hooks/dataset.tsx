import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { Dataset, DatasetStatistics } from "../interfaces/dataset.interface";
import { PredictedRating } from "../interfaces/model.interface";
import { DatasetsState, loadDatasetAsync, loadDatasetPRatingsAsync, loadDatasetStatisticsAsync, loadDatasetsAsync, selectDatasetsState } from "../slices/datasetsSlice";

export const useDatasets = (): DatasetsState => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(loadDatasetsAsync());
  }, [dispatch])

  return useAppSelector(selectDatasetsState);
};

export const useDataset = (datasetId?: number): Dataset | undefined => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (datasetId)
      dispatch(loadDatasetAsync(datasetId));
  }, [dispatch, datasetId])

  return useAppSelector(selectDatasetsState).dataset;
};

export const useDatasetStatistics = (datasetId?: number): DatasetStatistics | undefined => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (datasetId)
      dispatch(loadDatasetStatisticsAsync(datasetId));
  }, [dispatch, datasetId])

  return useAppSelector(selectDatasetsState).statistics;
};

export const useDatasetPRatings = (datasetId: number): PredictedRating[] => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (datasetId)
      dispatch(loadDatasetPRatingsAsync(datasetId));
  }, [dispatch, datasetId])

  return useAppSelector(selectDatasetsState).pRatings;
};