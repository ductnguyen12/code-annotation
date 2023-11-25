import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  DemographicQuestionGroupState,
  filterDemographicQuestionGroupsByParamsAsync,
  selectDemographicQuestionGroupState,
} from "../slices/demographicQuestionGroupSlice";
import {
  DemographicQuestionState,
  loadDemographicQuestionsAsync,
  selectDemographicQuestionState,
} from "../slices/demographicQuestionSlice";

export const useDemographicQuestions = (datasetId?: number): DemographicQuestionState => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadDemographicQuestionsAsync(datasetId));
  }, [dispatch, datasetId]);

  return useAppSelector(selectDemographicQuestionState);
}

export const useDemographicQuestionGroups = (datasetId?: number): DemographicQuestionGroupState => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(filterDemographicQuestionGroupsByParamsAsync({ datasetId }));
  }, [dispatch, datasetId])

  return useAppSelector(selectDemographicQuestionGroupState);
}