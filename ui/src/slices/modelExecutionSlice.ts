import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../api';
import { RootState } from '../app/store';
import { PageParams } from '../interfaces/common.interface';
import {
  ModelExecution, ModelExecutionParams,
} from '../interfaces/model.interface';
import { defaultAPIErrorHandle, defaultAPISuccessHandle } from '../util/error-util';

export interface ModelExecutionState {
  status: 'idle' | 'loading' | 'failed';
  executions: ModelExecution[];
  openDialog: boolean;
}

const DEFAULT_PAGE_PARAMS: PageParams = {
  pageNumber: 0,
  pageSize: 10,
  sort: 'lastModifiedDate,desc',
}

const initialState: ModelExecutionState = {
  status: 'idle',
  executions: [],
  openDialog: false,
};

export const loadModelExecutionsAsync = createAsyncThunk(
  'modelExecution/loadModelExecutions',
  async (params: ModelExecutionParams, { dispatch }) => {
    try {
      return await api.getModelExecutions({
        ...DEFAULT_PAGE_PARAMS,
        ...params,
      });
    } catch (error: any) {
      defaultAPIErrorHandle(error, dispatch);
      throw error;
    }
  }
);

export const createModelExecutionAsync = createAsyncThunk(
  'modelExecution/createModelExecution',
  async (model: ModelExecution, { dispatch }) => {
    try {
      const result = await api.createModelExecution(model);
      defaultAPISuccessHandle(`Created model execution '${result.id}' successfully`, dispatch);
      dispatch(loadModelExecutionsAsync({
        targetType: model.targetType,
        targetId: model.targetId,
        ...DEFAULT_PAGE_PARAMS,
      }));
    } catch (error: any) {
      defaultAPIErrorHandle(error, dispatch);
      throw error;
    }
  }
);

export const executionSlice = createSlice({
  name: 'modelExecution',
  initialState,
  reducers: {
    setOpenDialog: (state, action) => {
      state.openDialog = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loadModelExecutionsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadModelExecutionsAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.executions = action.payload.content;
      })
      .addCase(loadModelExecutionsAsync.rejected, (state) => {
        state.status = 'failed';
      })

      .addCase(createModelExecutionAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createModelExecutionAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.openDialog = false;
      })
      .addCase(createModelExecutionAsync.rejected, (state) => {
        state.status = 'failed';
      })
      ;
  },
});

export const {
  setOpenDialog,
} = executionSlice.actions;

export const selectModelExecutionState = (state: RootState) => state.modelExecution;

export default executionSlice.reducer;
