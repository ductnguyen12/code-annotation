import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import api from '../api';
import { RootState } from '../app/store';
import { Snippet, SnippetRate } from '../interfaces/snippet.interface';

export interface SnippetsState {
  status: 'idle' | 'loading' | 'failed';
  snippets: Snippet[];
  selected: number;
}

const initialState: SnippetsState = {
  status: 'idle',
  snippets: [],
  selected: 0,
};

export const loadDatasetSnippetsAsync = createAsyncThunk(
  'snippets/loadDatasetSnippets',
  async (datasetId: number) => {
    return await api.getDatasetSnippets(datasetId);
  }
);

export const rateSnippetAsync = createAsyncThunk(
  'snippets/rateSnippetAsync',
  async ({ snippetId, rate }: { snippetId: number, rate: SnippetRate }) => {
    await api.rateSnippet(snippetId, rate);
    return rate;
  }
);

export const snippetsSlice = createSlice({
  name: 'snippets',
  initialState,
  reducers: {
    chooseSnippet: (state, action: PayloadAction<number>) => {
      state.selected = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loadDatasetSnippetsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadDatasetSnippetsAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.snippets = action.payload;
      })
      .addCase(loadDatasetSnippetsAsync.rejected, (state) => {
        state.status = 'failed';
      })

      .addCase(rateSnippetAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(rateSnippetAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        const rate = action.payload as SnippetRate;
        state.snippets[state.selected].rate = rate;
      })
      .addCase(rateSnippetAsync.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { chooseSnippet } = snippetsSlice.actions;

export const selectSnippetsState = (state: RootState) => state.snippets;

export default snippetsSlice.reducer;
