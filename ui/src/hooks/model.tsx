import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { ModelExecutionParams } from "../interfaces/model.interface";
import { selectAuthState } from "../slices/authSlice";
import { ModelExecutionState, loadModelExecutionsAsync, selectModelExecutionState } from "../slices/modelExecutionSlice";
import { ModelState, loadModelsAsync, selectModelState } from "../slices/modelSlice";

export const useModels = (): ModelState => {
  const {
    authenticated,
  } = useAppSelector(selectAuthState);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!authenticated)
      return;
    dispatch(loadModelsAsync());
  }, [dispatch, authenticated]);

  return useAppSelector(selectModelState);
}

export const useModelExecutions = (params: ModelExecutionParams): ModelExecutionState => {
  const {
    authenticated,
  } = useAppSelector(selectAuthState);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!authenticated)
      return;

    dispatch(loadModelExecutionsAsync(params));
  }, [dispatch, authenticated, params]);

  return useAppSelector(selectModelExecutionState);
}
