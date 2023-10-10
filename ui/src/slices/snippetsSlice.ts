import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import api from '../api';
import { RootState } from '../app/store';
import { Snippet, SnippetRate } from '../interfaces/snippet.interface';
import { defaultAPIErrorHandle, defaultAPISuccessHandle } from '../util/error-util';

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
  async (datasetId: number, { dispatch }) => {
    try {
      return await api.getDatasetSnippets(datasetId);
    } catch (error: any) {
      defaultAPIErrorHandle(error, dispatch);
      throw error;
    }
  }
);

export const rateSnippetAsync = createAsyncThunk(
  'snippets/rateSnippetAsync',
  async ({ snippetId, rate }: { snippetId: number, rate: SnippetRate }, { dispatch }) => {
    try {
      await api.rateSnippet(snippetId, rate);
      defaultAPISuccessHandle(`Rated snippet '${snippetId}': ${rate.value} stars`, dispatch);
    } catch (error: any) {
      defaultAPIErrorHandle(error, dispatch);
      throw error;
    }
    return { snippetId, rate };
  }
);

export const snippetsSlice = createSlice({
  name: 'snippets',
  initialState,
  reducers: {
    chooseSnippet: (state, action: PayloadAction<number>) => {
      state.selected = action.payload;
    },
    updateCurrentRateByKey: (state, action) => {
      if (state.selected < state.snippets.length) {
        const rate: SnippetRate = state.snippets[state.selected].rate || {
          value: undefined,
          comment: undefined,
          selectedAnswers: [],
        };
        switch (action.payload.key) {
          case 'comment':
            rate.comment = action.payload.value;
            break;
          case 'rate':
            rate.value = action.payload.value;
            break;
          case 'choices':
            rate.selectedAnswers = action.payload.value;
            break;
          default:
            break;
        }

        state.snippets[state.selected].rate = rate;
      }
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
        const { snippetId, rate } = action.payload;
        state.snippets.forEach(snippet => {
          if (snippet.id === snippetId)
            snippet.rate = rate;
        })
      })
      .addCase(rateSnippetAsync.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const {
  chooseSnippet,
  updateCurrentRateByKey,
} = snippetsSlice.actions;

export const selectSnippetsState = (state: RootState) => state.snippets;

export default snippetsSlice.reducer;
