import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit';
import appReducer from '../components/App/appSlice';
import authReducer from '../slices/authSlice';
import datasetsReducer from '../slices/datasetsSlice';
import demographicQuestionGroupReducer from '../slices/demographicQuestionGroupSlice';
import demographicQuestionReducer from '../slices/demographicQuestionSlice';
import modelExecutionReducer from '../slices/modelExecutionSlice';
import modelReducer from '../slices/modelSlice';
import notificationReducer from '../slices/notificationSlice';
import raterRegReducer from '../slices/raterRegSlice';
import snippetsReducer from '../slices/snippetsSlice';

export const store = configureStore({
  reducer: {
    app: appReducer,
    auth: authReducer,
    datasets: datasetsReducer,
    demographicQuestionGroup: demographicQuestionGroupReducer,
    demographicQuestion: demographicQuestionReducer,
    modelExecution: modelExecutionReducer,
    model: modelReducer,
    notification: notificationReducer,
    raterReg: raterRegReducer,
    snippets: snippetsReducer,
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
