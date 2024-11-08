import { createAsyncThunk, createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import api from '../api';
import { RootState } from '../app/store';
import { Page, PageParams } from '../interfaces/common.interface';
import { Dataset, DatasetParams, DatasetStatistics } from '../interfaces/dataset.interface';
import { PredictedRating } from '../interfaces/model.interface';
import { Submission } from '../interfaces/submission.interface';
import { defaultAPIErrorHandle, defaultAPISuccessHandle } from '../util/error-util';

export interface DatasetsState {
  status: 'idle' | 'loading' | 'failed';
  totalPages: number;
  datasets: Dataset[];
  dataset?: Dataset;
  configuration: any;
  statistics?: DatasetStatistics;
  pRatings: PredictedRating[];
  submissions: Submission[];
}

const initialState: DatasetsState = {
  status: 'idle',
  totalPages: 0,
  datasets: [],
  dataset: undefined,
  configuration: {},
  statistics: undefined,
  pRatings: [],
  submissions: [],
};

export const loadDatasetsAsync = createAsyncThunk<
  Page<Dataset>,
  { pParams: PageParams, dParams?: DatasetParams },
  { dispatch: Dispatch }
>(
  'datasets/loadDatasets',
  async ({ pParams, dParams }, { dispatch }) => {
    try {
      return await api.getDatasetPage(pParams, dParams);
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

export const loadDatasetSubmissionsAsync = createAsyncThunk(
  'datasets/loadDatasetSubmissions',
  async (datasetId: number, { dispatch }) => {
    try {
      return await api.getSubmissions(datasetId);
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

export const patchDatasetThenReloadAsync = createAsyncThunk(
  'datasets/patchDatasetThenReloadAsync',
  async ({
    datasetId,
    dataset,
    pParams,
    dParams,
  }: {
    datasetId: number,
    dataset: DatasetParams,
    pParams: PageParams,
    dParams?: DatasetParams
  }, { dispatch }) => {
    try {
      const updatedDataset = await api.patchDataset(datasetId, dataset);
      defaultAPISuccessHandle(`Dataset '${datasetId}' was updated successfully`, dispatch);
      dispatch(loadDatasetsAsync({ pParams, dParams }));
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
      defaultAPIErrorHandle(error, dispatch, `Could not delete dataset ${datasetId}`);
      throw error;
    }
  }
);

export const duplicateDatasetAsync = createAsyncThunk(
  'datasets/duplicateDatasetAsync',
  async ({
    datasetId,
    params,
    onSuccess,
  }: {
    datasetId: number,
    params?: {
      withSnippet?: boolean,
    },
    onSuccess?: () => void,
  }, { dispatch }) => {
    try {
      const duplicatedDataset = await api.duplicateDataset(datasetId, params);
      defaultAPISuccessHandle(`Duplicated dataset '${datasetId}' successfully`, dispatch);
      onSuccess && onSuccess();
      return duplicatedDataset;
    } catch (error: any) {
      defaultAPIErrorHandle(error, dispatch);
      throw error;
    }
  }
);

export const importSnippetsAsync = createAsyncThunk(
  'datasets/importSnippetsAsync',
  async ({
    datasetId,
    files,
    onSuccess,
  }: {
    datasetId: number,
    files: File[],
    onSuccess?: () => void,
  }, { dispatch }) => {
    try {
      await api.importDatasetSnippets(datasetId, files);
      defaultAPISuccessHandle(`Imported snippets to dataset '${datasetId}' successfully`, dispatch);
      onSuccess && onSuccess();
    } catch (error: any) {
      defaultAPIErrorHandle(error, dispatch);
      throw error;
    }
  }
);

export const exportSnippetsAsync = createAsyncThunk(
  'datasets/exportSnippetsAsync',
  async ({
    datasetId,
    raterIds,
    onSuccess,
  }: {
    datasetId: number,
    raterIds?: string[],
    onSuccess?: () => void,
  }, { dispatch }) => {
    try {
      await api.exportDatasetSnippets(datasetId, raterIds);
      defaultAPISuccessHandle(`Exported snippets of dataset '${datasetId}' successfully`, dispatch);
      onSuccess && onSuccess();
    } catch (error: any) {
      defaultAPIErrorHandle(error, dispatch);
      throw error;
    }
  }
);

export const loadDatasetConfigurationAsync = createAsyncThunk(
  'datasets/loadDatasetConfigurationAsync',
  async (datasetId: number) => {
    try {
      const result = await api.getDatasetConfiguration(datasetId);
      return result;
    } catch (error: any) {
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

    deleteConfiguration: (state, action: PayloadAction<{ key: string }>) => {
      if (state.configuration && action.payload.key in state.configuration) {
        delete state.configuration[action.payload.key];
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
        state.datasets = action.payload.content;
        state.totalPages = action.payload.totalPages;
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

      .addCase(loadDatasetSubmissionsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadDatasetSubmissionsAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.submissions = action.payload;
      })
      .addCase(loadDatasetSubmissionsAsync.rejected, (state) => {
        state.status = 'failed';
      })

      .addCase(createDatasetAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createDatasetAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.dataset = undefined;
        state.configuration = undefined;
        state.datasets = [action.payload, ...state.datasets];
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

      .addCase(patchDatasetThenReloadAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(patchDatasetThenReloadAsync.fulfilled, (state, action) => {
        state.status = 'idle';
      })
      .addCase(patchDatasetThenReloadAsync.rejected, (state) => {
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

      .addCase(duplicateDatasetAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(duplicateDatasetAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.dataset = undefined;
        state.configuration = undefined;
      })
      .addCase(duplicateDatasetAsync.rejected, (state) => {
        state.status = 'failed';
      })

      .addCase(importSnippetsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(importSnippetsAsync.fulfilled, (state, action) => {
        state.status = 'idle';
      })
      .addCase(importSnippetsAsync.rejected, (state) => {
        state.status = 'failed';
      })

      .addCase(exportSnippetsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(exportSnippetsAsync.fulfilled, (state, action) => {
        state.status = 'idle';
      })
      .addCase(exportSnippetsAsync.rejected, (state) => {
        state.status = 'failed';
      })

      .addCase(loadDatasetConfigurationAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadDatasetConfigurationAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.configuration = action.payload;
      })
      .addCase(loadDatasetConfigurationAsync.rejected, (state) => {
        state.status = 'failed';
      })
      ;
  },
});

export const {
  chooseDataset,
  updateConfiguration,
  deleteConfiguration,
} = datasetsSlice.actions;

export const selectDatasets = (state: RootState) => state.datasets.datasets;
export const selectDatasetsState = (state: RootState) => state.datasets;

export default datasetsSlice.reducer;
