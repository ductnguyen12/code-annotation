import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../api';
import { RootState } from '../app/store';
import { Rater } from '../interfaces/rater.interface';
import { defaultAPIErrorHandle } from '../util/error-util';

export interface RaterState {
  status: 'idle' | 'loading' | 'failed';
  rater?: Rater;
}

const initialState: RaterState = {
  status: 'idle',
  rater: undefined,
};

export const getRaterAsync = createAsyncThunk(
  'rater/getRaterAsync',
  async (raterId: string, { dispatch }) => {
    try {
      const result = await api.getRaterById(raterId);
      return result;
    } catch (error: any) {
      defaultAPIErrorHandle(error, dispatch);
      throw error;
    }
  }
);

export const raterSlice = createSlice({
  name: 'rater',
  initialState,
  reducers: {
  },

  extraReducers: (builder) => {
    builder
      .addCase(getRaterAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getRaterAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.rater = action.payload;
      })
      .addCase(getRaterAsync.rejected, (state) => {
        state.status = 'failed';
        state.rater = undefined;
      })
      ;
  },
});

export const {
} = raterSlice.actions;

export const selectRaterState = (state: RootState) => state.rater;

export default raterSlice.reducer;
