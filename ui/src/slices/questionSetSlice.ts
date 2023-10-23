import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../api';
import { RootState } from '../app/store';
import { QuestionSet } from '../interfaces/question.interface';
import { defaultAPIErrorHandle, defaultAPISuccessHandle } from '../util/error-util';

export interface QuestionSetState {
  status: 'idle' | 'loading' | 'failed';
  questionSets: QuestionSet[];
  selected?: QuestionSet;
  openDialog: boolean;
}

const initialState: QuestionSetState = {
  status: 'idle',
  questionSets: [],
  selected: undefined,
  openDialog: false,
};

export const loadQuestionSetsAsync = createAsyncThunk(
  'questionSet/loadQuestionSets',
  async (_, { dispatch }) => {
    try {
      return await api.getQuestionSets();
    } catch (error: any) {
      defaultAPIErrorHandle(error, dispatch);
      throw error;
    }
  }
);

export const createQuestionSetAsync = createAsyncThunk(
  'questionSet/createQuestionSet',
  async (questionSet: QuestionSet, { dispatch }) => {
    try {
      await api.createQuestionSet(questionSet);
      defaultAPISuccessHandle(`Created question group '${questionSet.title}' successfully`, dispatch);
      dispatch(loadQuestionSetsAsync());
    } catch (error: any) {
      defaultAPIErrorHandle(error, dispatch);
      throw error;
    }
  }
);

export const updateQuestionSetAsync = createAsyncThunk(
  'questionSet/updateQuestionSet',
  async ({ questionSetId, questionSet }: { questionSetId: number, questionSet: QuestionSet }, { dispatch }) => {
    try {
      await api.updateQuestionSet(questionSetId, questionSet);
      defaultAPISuccessHandle(`Updated question group '${questionSet.title}' successfully`, dispatch);
      dispatch(loadQuestionSetsAsync());
    } catch (error: any) {
      defaultAPIErrorHandle(error, dispatch);
      throw error;
    }
  }
);

export const deleteQuestionSetAsync = createAsyncThunk(
  'questionSet/deleteQuestionSet',
  async (questionSetId: number, { dispatch }) => {
    try {
      await api.deleteQuestionSet(questionSetId);
      defaultAPISuccessHandle(`Delete question group ID '${questionSetId}' successfully`, dispatch);
      dispatch(loadQuestionSetsAsync());
    } catch (error: any) {
      defaultAPIErrorHandle(error, dispatch);
      throw error;
    }
  }
);

export const questionSetSlice = createSlice({
  name: 'questionSet',
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
      .addCase(loadQuestionSetsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadQuestionSetsAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.questionSets = action.payload;
      })
      .addCase(loadQuestionSetsAsync.rejected, (state) => {
        state.status = 'failed';
      })

      .addCase(createQuestionSetAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createQuestionSetAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.openDialog = false;
      })
      .addCase(createQuestionSetAsync.rejected, (state) => {
        state.status = 'failed';
      })

      .addCase(updateQuestionSetAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateQuestionSetAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.selected = undefined;
        state.openDialog = false;
      })
      .addCase(updateQuestionSetAsync.rejected, (state) => {
        state.status = 'failed';
        state.selected = undefined;
      })

      .addCase(deleteQuestionSetAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteQuestionSetAsync.fulfilled, (state, action) => {
        state.status = 'idle';
      })
      .addCase(deleteQuestionSetAsync.rejected, (state) => {
        state.status = 'failed';
      })
      ;
  },
});

export const {
  setSelected,
  setOpenDialog,
} = questionSetSlice.actions;

export const selectQuestionSetState = (state: RootState) => state.questionSet;

export default questionSetSlice.reducer;
