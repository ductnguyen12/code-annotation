import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit';
import appReducer from '../components/App/appSlice';
import authReducer from '../slices/authSlice';
import datasetsReducer from '../slices/datasetsSlice';
import demographicQuestionReducer from '../slices/demographicQuestionSlice';
import notificationReducer from '../slices/notificationSlice';
import questionSetReducer from '../slices/questionSetSlice';
import raterRegReducer from '../slices/raterRegSlice';
import snippetsReducer from '../slices/snippetsSlice';

export const store = configureStore({
  reducer: {
    app: appReducer,
    notification: notificationReducer,
    datasets: datasetsReducer,
    snippets: snippetsReducer,
    auth: authReducer,
    questionSet: questionSetReducer,
    demographicQuestion: demographicQuestionReducer,
    raterReg: raterRegReducer,
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
