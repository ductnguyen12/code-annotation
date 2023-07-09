import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { AuthState, getCurrentUserAsync, selectAuthState } from "../slices/authSlice";

export const useAuthentication = (): AuthState => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getCurrentUserAsync());
  }, [dispatch])

  return useAppSelector(selectAuthState);
}