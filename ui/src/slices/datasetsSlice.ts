import { createAsyncThunk, createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import api from '../api';
import { RootState } from '../app/store';
import { Dataset } from '../interfaces/dataset.interface';
import { defaultAPIErrorHandle } from '../util/error-util';

export interface DatasetsState {
  status: 'idle' | 'loading' | 'failed';
  datasets: Dataset[];
  dataset: Dataset | undefined;
  configuration: any;
}

const initialState: DatasetsState = {
  status: 'idle',
  datasets: [],
  dataset: undefined,
  configuration: {},
};

export const loadDatasetsAsync = createAsyncThunk<Dataset[], void, { dispatch: Dispatch }>(
  'datasets/loadDatasets',
  async (_, { dispatch }) => {
    try {
      return await api.getDatasets();
    } catch (error: any) {
      defaultAPIErrorHandle(error, dispatch, 'Could not fetch list of datasets');
      throw error;
    }
  }
);

export const loadDatasetAsync = createAsyncThunk(
  'datasets/loadDataset',
  async (datasetId: number, { dispatch }) => {
    try {
      return await api.getDataset(datasetId);
    } catch (error: any) {
      defaultAPIErrorHandle(error, dispatch);
      throw error;
    }
  }
);

export const deleteDatasetAsync = createAsyncThunk<number, number, { dispatch: Dispatch }>(
  'datasets/deleteDataset',
  async (datasetId: number, { dispatch }) => {
    try {
      await api.deleteDataset(datasetId);
      return datasetId;
    } catch (error: any) {
      defaultAPIErrorHandle(error, dispatch, 'Could not fetch list of datasets');
      throw error;
    }
  }
);

export const datasetsSlice = createSlice({
  name: 'datasets',
  initialState,
  reducers: {
    chooseDataset: (state, action: PayloadAction<number>) => {
      if (action.payload >= 0) {
        state.dataset = state.datasets.find(d => d.id === action.payload);
      }
    },
    updateConfiguration: (state, action: PayloadAction<{ key: string, value: any }>) => {
      state.configuration[action.payload.key] = action.payload.value;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loadDatasetsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadDatasetsAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.datasets = action.payload;
      })
      .addCase(loadDatasetsAsync.rejected, (state) => {
        state.status = 'failed';
      })

      .addCase(loadDatasetAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadDatasetAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.dataset = action.payload;
      })
      .addCase(loadDatasetAsync.rejected, (state) => {
        state.status = 'failed';
      })

      .addCase(deleteDatasetAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteDatasetAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.datasets = state.datasets.filter(dataset => dataset.id !== action.payload);
      })
      .addCase(deleteDatasetAsync.rejected, (state) => {
        state.status = 'failed';
      })
      ;
  },
});

export const {
  chooseDataset,
  updateConfiguration,
} = datasetsSlice.actions;

export const selectDatasets = (state: RootState) => state.datasets.datasets;
export const selectDatasetsState = (state: RootState) => state.datasets;

export default datasetsSlice.reducer;
