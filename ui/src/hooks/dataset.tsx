import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { Dataset, DatasetStatistics } from "../interfaces/dataset.interface";
import { PredictedRating } from "../interfaces/model.interface";
import { selectAuthState } from "../slices/authSlice";
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
  const {
    authenticated,
  } = useAppSelector(selectAuthState);

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (datasetId && authenticated)
      dispatch(loadDatasetStatisticsAsync(datasetId));
  }, [dispatch, authenticated, datasetId])

  return useAppSelector(selectDatasetsState).statistics;
};

export const useDatasetPRatings = (datasetId: number): PredictedRating[] => {
  const {
    authenticated,
  } = useAppSelector(selectAuthState);

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (datasetId && authenticated)
      dispatch(loadDatasetPRatingsAsync(datasetId));
  }, [dispatch, authenticated, datasetId])

  return useAppSelector(selectDatasetsState).pRatings;
};