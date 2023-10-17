import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { QuestionSetState, loadQuestionSetsAsync, selectQuestionSetState } from "../slices/questionSetSlice";

export const useQuestionSets = (): QuestionSetState => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadQuestionSetsAsync());
  }, [dispatch])

  return useAppSelector(selectQuestionSetState);
}