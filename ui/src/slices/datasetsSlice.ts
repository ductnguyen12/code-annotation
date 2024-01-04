import { createAsyncThunk, createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import api from '../api';
import { RootState } from '../app/store';
import { Dataset, DatasetStatistics } from '../interfaces/dataset.interface';
import { PredictedRating } from '../interfaces/model.interface';
import { defaultAPIErrorHandle, defaultAPISuccessHandle } from '../util/error-util';

export interface DatasetsState {
  status: 'idle' | 'loading' | 'failed';
  datasets: Dataset[];
  dataset?: Dataset;
  configuration: any;
  statistics?: DatasetStatistics;
  pRatings: PredictedRating[];
}

const initialState: DatasetsState = {
  status: 'idle',
  datasets: [],
  dataset: undefined,
  configuration: {},
  statistics: undefined,
  pRatings: [],
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

export const loadDatasetStatisticsAsync = createAsyncThunk(
  'datasets/loadDatasetStatistics',
  async (datasetId: number, { dispatch }) => {
    try {
      return await api.getDatasetStatistics(datasetId);
    } catch (error: any) {
      defaultAPIErrorHandle(error, dispatch);
      throw error;
    }
  }
);

export const loadDatasetPRatingsAsync = createAsyncThunk(
  'datasets/loadDatasetPRatings',
  async (datasetId: number, { dispatch }) => {
    try {
      return await api.getDatasetPrediction(datasetId);
    } catch (error: any) {
      defaultAPIErrorHandle(error, dispatch);
      throw error;
    }
  }
);

export const createDatasetAsync = createAsyncThunk(
  'datasets/createDatasetAsync',
  async (dataset: Dataset, { dispatch }) => {
    try {
      const newDataset = await api.createDataset(dataset);
      defaultAPISuccessHandle(`Dataset '${newDataset.id}' was created successfully`, dispatch);
      return newDataset;
    } catch (error: any) {
      defaultAPIErrorHandle(error, dispatch);
      throw error;
    }
  }
);

export const updateDatasetAsync = createAsyncThunk(
  'datasets/updateDatasetAsync',
  async ({ datasetId, dataset }: { datasetId: number, dataset: Dataset }, { dispatch }) => {
    try {
      const updatedDataset = await api.updateDataset(datasetId, dataset);
      defaultAPISuccessHandle(`Dataset '${datasetId}' was updated successfully`, dispatch);
      return updatedDataset;
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
        state.configuration = state.dataset?.configuration;
      } else {
        state.dataset = undefined;
        state.configuration = undefined;
      }
    },
    updateConfiguration: (state, action: PayloadAction<{ key: string, value: any }>) => {
      if (!state.configuration) {
        state.configuration = {};
      }
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

      .addCase(loadDatasetStatisticsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadDatasetStatisticsAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.dataset = action.payload.dataset;
        state.statistics = action.payload;
      })
      .addCase(loadDatasetStatisticsAsync.rejected, (state) => {
        state.status = 'failed';
      })

      .addCase(loadDatasetPRatingsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadDatasetPRatingsAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.pRatings = action.payload;
      })
      .addCase(loadDatasetPRatingsAsync.rejected, (state) => {
        state.status = 'failed';
      })

      .addCase(createDatasetAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createDatasetAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.dataset = undefined;
        state.configuration = undefined;
        state.datasets.push(action.payload);
      })
      .addCase(createDatasetAsync.rejected, (state) => {
        state.status = 'failed';
      })

      .addCase(updateDatasetAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateDatasetAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.dataset = undefined;
        state.configuration = undefined;
        const index = state.datasets.findIndex(dataset => dataset.id === action.payload.id);
        if (index > -1)
          state.datasets[index] = action.payload;
      })
      .addCase(updateDatasetAsync.rejected, (state) => {
        state.status = 'failed';
      })

      .addCase(deleteDatasetAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteDatasetAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.dataset = undefined;
        state.configuration = undefined;
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
