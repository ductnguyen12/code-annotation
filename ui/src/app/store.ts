import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit';
import appReducer from '../components/App/appSlice';
import authReducer from '../slices/authSlice';
import datasetsReducer from '../slices/datasetsSlice';
import notificationReducer from '../slices/notificationSlice';
import snippetsReducer from '../slices/snippetsSlice';

export const store = configureStore({
  reducer: {
    app: appReducer,
    notification: notificationReducer,
    datasets: datasetsReducer,
    snippets: snippetsReducer,
    auth: authReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
