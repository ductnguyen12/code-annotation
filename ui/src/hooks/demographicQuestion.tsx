import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { DemographicQuestionState, loadDemographicQuestionsAsync, selectDemographicQuestionState } from "../slices/demographicQuestionSlice";
import { DemographicQuestionGroupState, loadDemographicQuestionGroupsAsync, selectDemographicQuestionGroupState } from "../slices/demographicQuestionGroupSlice";

export const useDemographicQuestions = (): DemographicQuestionState => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadDemographicQuestionsAsync());
  }, [dispatch])

  return useAppSelector(selectDemographicQuestionState);
}

export const useDemographicQuestionGroups = (): DemographicQuestionGroupState => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadDemographicQuestionGroupsAsync());
  }, [dispatch])

  return useAppSelector(selectDemographicQuestionGroupState);
}