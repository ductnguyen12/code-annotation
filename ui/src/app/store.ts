import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import appReducer from '../components/App/appSlice';
import datasetsReducer from '../slices/datasetsSlice';
import snippetsReducer from '../slices/snippetsSlice';
import snippetReducer from '../slices/snippetSlice';
import authReducer from '../slices/authSlice';

export const store = configureStore({
  reducer: {
    app: appReducer,
    datasets: datasetsReducer,
    snippets: snippetsReducer,
    snippet: snippetReducer,
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
