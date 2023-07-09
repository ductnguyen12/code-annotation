import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import api from '../api';
import { RootState } from '../app/store';
import { Dataset } from '../interfaces/dataset.interface';

export interface DatasetsState {
  status: 'idle' | 'loading' | 'failed';
  datasets: Dataset[];
  dataset: Dataset | undefined;
}

const initialState: DatasetsState = {
  status: 'idle',
  datasets: [],
  dataset: undefined,
};

export const loadDatasetsAsync = createAsyncThunk(
  'datasets/loadDatasets',
  async () => {
    return await api.getDatasets();
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
      });
  },
});

export const { chooseDataset } = datasetsSlice.actions;

export const selectDatasets = (state: RootState) => state.datasets.datasets;
export const selectDatasetsState = (state: RootState) => state.datasets;

export default datasetsSlice.reducer;
