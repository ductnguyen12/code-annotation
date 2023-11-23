import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { DemographicQuestionGroupState, loadDemographicQuestionGroupsAsync, selectDemographicQuestionGroupState } from "../slices/demographicQuestionGroupSlice";
import { DemographicQuestionState, loadDemographicQuestionsAsync, selectDemographicQuestionState } from "../slices/demographicQuestionSlice";

export const useDemographicQuestions = (datasetId?: number): DemographicQuestionState => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadDemographicQuestionsAsync(datasetId));
  }, [dispatch, datasetId]);

  return useAppSelector(selectDemographicQuestionState);
}

export const useDemographicQuestionGroups = (): DemographicQuestionGroupState => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadDemographicQuestionGroupsAsync());
  }, [dispatch])

  return useAppSelector(selectDemographicQuestionGroupState);
}