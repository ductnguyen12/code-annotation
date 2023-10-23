import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../api';
import { RootState } from '../app/store';
import { DemographicQuestion } from '../interfaces/question.interface';
import { defaultAPIErrorHandle, defaultAPISuccessHandle } from '../util/error-util';

export interface DemographicQuestionState {
  status: 'idle' | 'loading' | 'failed';
  questions: DemographicQuestion[];
  selected?: DemographicQuestion;
  openDialog: boolean;
}

const initialState: DemographicQuestionState = {
  status: 'idle',
  questions: [],
  selected: undefined,
  openDialog: false,
};

export const loadDemographicQuestionsAsync = createAsyncThunk(
  'demographicQuestion/loadDemographicQuestions',
  async (_, { dispatch }) => {
    try {
      return await api.getDemographicQuestions();
    } catch (error: any) {
      defaultAPIErrorHandle(error, dispatch);
      throw error;
    }
  }
);

export const createDemographicQuestionAsync = createAsyncThunk(
  'demographicQuestion/createDemographicQuestion',
  async (question: DemographicQuestion, { dispatch }) => {
    try {
      await api.createDemographicQuestion(question);
      defaultAPISuccessHandle('Created question successfully', dispatch);
      dispatch(loadDemographicQuestionsAsync());
    } catch (error: any) {
      defaultAPIErrorHandle(error, dispatch);
      throw error;
    }
  }
);

export const updateDemographicQuestionAsync = createAsyncThunk(
  'demographicQuestion/updateDemographicQuestion',
  async ({ questionId, question }: { questionId: number, question: DemographicQuestion }, { dispatch }) => {
    try {
      await api.updateDemographicQuestion(questionId, question);
      defaultAPISuccessHandle(`Updated question ID '${questionId}' successfully`, dispatch);
      dispatch(loadDemographicQuestionsAsync());
    } catch (error: any) {
      defaultAPIErrorHandle(error, dispatch);
      throw error;
    }
  }
);

export const deleteDemographicQuestionAsync = createAsyncThunk(
  'demographicQuestion/deleteDemographicQuestion',
  async (questionId: number, { dispatch }) => {
    try {
      await api.deleteDemographicQuestion(questionId);
      defaultAPISuccessHandle(`Delete question group ID '${questionId}' successfully`, dispatch);
      dispatch(loadDemographicQuestionsAsync());
    } catch (error: any) {
      defaultAPIErrorHandle(error, dispatch);
      throw error;
    }
  }
);

export const demographicQuestionSlice = createSlice({
  name: 'demographicQuestion',
  initialState,
  reducers: {
    setSelected: (state, action) => {
      state.selected = action.payload;
    },

    setOpenDialog: (state, action) => {
      state.openDialog = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loadDemographicQuestionsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadDemographicQuestionsAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.questions = action.payload;
      })
      .addCase(loadDemographicQuestionsAsync.rejected, (state) => {
        state.status = 'failed';
      })

      .addCase(createDemographicQuestionAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createDemographicQuestionAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.openDialog = false;
      })
      .addCase(createDemographicQuestionAsync.rejected, (state) => {
        state.status = 'failed';
      })

      .addCase(updateDemographicQuestionAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateDemographicQuestionAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.selected = undefined;
        state.openDialog = false;
      })
      .addCase(updateDemographicQuestionAsync.rejected, (state) => {
        state.status = 'failed';
        state.selected = undefined;
      })

      .addCase(deleteDemographicQuestionAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteDemographicQuestionAsync.fulfilled, (state, action) => {
        state.status = 'idle';
      })
      .addCase(deleteDemographicQuestionAsync.rejected, (state) => {
        state.status = 'failed';
      })
      ;
  },
});

export const {
  setSelected,
  setOpenDialog,
} = demographicQuestionSlice.actions;

export const selectDemographicQuestionState = (state: RootState) => state.demographicQuestion;

export default demographicQuestionSlice.reducer;
