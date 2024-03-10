import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { Rater } from "../interfaces/rater.interface";
import { getRaterAsync, selectRaterState } from "../slices/raterSlice";

export const useRater = (raterId?: string): Rater => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (raterId)
      dispatch(getRaterAsync(raterId));
  }, [dispatch, raterId])

  return useAppSelector(selectRaterState).rater as Rater;
};