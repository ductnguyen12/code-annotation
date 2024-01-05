import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../api';
import { RootState } from '../app/store';
import { Rater } from '../interfaces/rater.interface';
import { defaultAPIErrorHandle, defaultAPISuccessHandle } from '../util/error-util';

export interface RaterRegState {
  status: 'idle' | 'loading' | 'failed';
  rater?: Rater;
}

const initialState: RaterRegState = {
  status: 'idle',
  rater: undefined,
};

export const registerRaterAsync = createAsyncThunk(
  'raterReg/registerRater',
  async (rater: Rater, { dispatch }) => {
    try {
      const result = await api.registerAsRater(rater);
      defaultAPISuccessHandle(`Registered '${result.id}' successfully`, dispatch);
      return result;
    } catch (error: any) {
      defaultAPIErrorHandle(error, dispatch);
      throw error;
    }
  }
);

export const getRaterByExternalInfoAsync = createAsyncThunk(
  'raterReg/getRaterByExternalInfoAsync',
  async ({ externalSystem, externalId, datasetId }: { externalSystem: string, externalId: string, datasetId: number }) => {
    try {
      const result = await api.getRaterByExternalInfo(externalSystem, externalId, datasetId);
      return result;
    } catch (error: any) {
      throw error;
    }
  }
);

export const getCurrentRaterAsync = createAsyncThunk(
  'raterReg/getCurrentRaterAsync',
  async (datasetId: number) => {
    try {
      const result = await api.getCurrentRater(datasetId);
      return result;
    } catch (error: any) {
      throw error;
    }
  }
);

export const raterRegSlice = createSlice({
  name: 'raterReg',
  initialState,
  reducers: {
    setRater: (state, action) => {
      state.rater = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(registerRaterAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(registerRaterAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.rater = action.payload;
      })
      .addCase(registerRaterAsync.rejected, (state) => {
        state.status = 'failed';
      })

      .addCase(getRaterByExternalInfoAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getRaterByExternalInfoAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.rater = action.payload;
      })
      .addCase(getRaterByExternalInfoAsync.rejected, (state) => {
        state.status = 'failed';
        state.rater = undefined;
      })

      .addCase(getCurrentRaterAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getCurrentRaterAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.rater = action.payload;
      })
      .addCase(getCurrentRaterAsync.rejected, (state) => {
        state.status = 'failed';
      })
      ;
  },
});

export const {
  setRater,
} = raterRegSlice.actions;

export const selectRaterRegState = (state: RootState) => state.raterReg;

export default raterRegSlice.reducer;
