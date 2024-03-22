import { Dispatch } from "@reduxjs/toolkit";
import { pushNotification } from "../slices/notificationSlice";

export const defaultAPISuccessHandle = (message: string, dispatch: Dispatch) => {
  dispatch(pushNotification({
    message: message,
    variant: 'success',
  }));
}

export const defaultAPIErrorHandle = (error: any, dispatch: Dispatch, message?: string) => {
  dispatch(pushNotification({
    message: getErrorMessage(error, message),
    variant: 'error',
  }));
};

export const getErrorMessage = (error: any, message?: string) => {
  let errorMsg = error.title || error.message;
  if (message)
    errorMsg = message;
  else if (error.response) {
    errorMsg = error.response.data.title || error.response.data.message;
    if (error.response.data.fieldErrors && error.response.data.fieldErrors.length > 0) {
      errorMsg = error.response.data.fieldErrors
        .map((fieldError: any) => fieldError.message)
        .join(' and ');
    } else if (error.response.data.violations && error.response.data.violations.length > 0) {
      errorMsg = error.response.data.violations
        .map((fieldError: any) => fieldError.message)
        .join(' and ');
    }
  }
  return errorMsg;
}