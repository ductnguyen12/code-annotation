import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { ModelExecutionParams } from "../interfaces/model.interface";
import { ModelExecutionState, loadModelExecutionsAsync, selectModelExecutionState } from "../slices/modelExecutionSlice";
import { ModelState, loadModelsAsync, selectModelState } from "../slices/modelSlice";

export const useModels = (): ModelState => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadModelsAsync());
  }, [dispatch]);

  return useAppSelector(selectModelState);
}

export const useModelExecutions = (params: ModelExecutionParams): ModelExecutionState => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadModelExecutionsAsync(params));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return useAppSelector(selectModelExecutionState);
}
