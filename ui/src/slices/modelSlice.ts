import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../api';
import { RootState } from '../app/store';
import {
  Model,
} from '../interfaces/model.interface';
import { defaultAPIErrorHandle, defaultAPISuccessHandle } from '../util/error-util';

export interface ModelState {
  status: 'idle' | 'loading' | 'failed';
  models: Model[];
  selected?: Model;
  openDialog: boolean;
}

const initialState: ModelState = {
  status: 'idle',
  models: [],
  selected: undefined,
  openDialog: false,
};

export const loadModelsAsync = createAsyncThunk(
  'model/loadModels',
  async (_, { dispatch }) => {
    try {
      return await api.getModels();
    } catch (error: any) {
      defaultAPIErrorHandle(error, dispatch);
      throw error;
    }
  }
);

export const createModelAsync = createAsyncThunk(
  'model/createModel',
  async (model: Model, { dispatch }) => {
    try {
      await api.createModel(model);
      defaultAPISuccessHandle(`Created model '${model.name}' successfully`, dispatch);
      dispatch(loadModelsAsync());
    } catch (error: any) {
      defaultAPIErrorHandle(error, dispatch);
      throw error;
    }
  }
);

export const updateModelAsync = createAsyncThunk(
  'model/updateModel',
  async ({ modelId, model }: { modelId: number, model: Model }, { dispatch }) => {
    try {
      await api.updateModel(modelId, model);
      defaultAPISuccessHandle(`Updated model '${model.name}' successfully`, dispatch);
      dispatch(loadModelsAsync());
    } catch (error: any) {
      defaultAPIErrorHandle(error, dispatch);
      throw error;
    }
  }
);

export const deleteModelAsync = createAsyncThunk(
  'model/deleteModel',
  async (modelId: number, { dispatch }) => {
    try {
      await api.deleteModel(modelId);
      defaultAPISuccessHandle(`Delete model ID '${modelId}' successfully`, dispatch);
      dispatch(loadModelsAsync());
    } catch (error: any) {
      defaultAPIErrorHandle(error, dispatch);
      throw error;
    }
  }
);

export const modelslice = createSlice({
  name: 'model',
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
      .addCase(loadModelsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadModelsAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.models = action.payload;
      })
      .addCase(loadModelsAsync.rejected, (state) => {
        state.status = 'failed';
      })

      .addCase(createModelAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createModelAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.openDialog = false;
      })
      .addCase(createModelAsync.rejected, (state) => {
        state.status = 'failed';
      })

      .addCase(updateModelAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateModelAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.selected = undefined;
        state.openDialog = false;
      })
      .addCase(updateModelAsync.rejected, (state) => {
        state.status = 'failed';
        state.selected = undefined;
      })

      .addCase(deleteModelAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteModelAsync.fulfilled, (state, action) => {
        state.status = 'idle';
      })
      .addCase(deleteModelAsync.rejected, (state) => {
        state.status = 'failed';
      })
      ;
  },
});

export const {
  setSelected,
  setOpenDialog,
} = modelslice.actions;

export const selectModelState = (state: RootState) => state.model;

export default modelslice.reducer;
