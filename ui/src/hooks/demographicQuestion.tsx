import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { DemographicQuestionState, loadDemographicQuestionsAsync, selectDemographicQuestionState } from "../slices/demographicQuestionSlice";

export const useDemographicQuestions = (): DemographicQuestionState => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadDemographicQuestionsAsync());
  }, [dispatch])

  return useAppSelector(selectDemographicQuestionState);
}