import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import api from '../api';
import { RootState } from '../app/store';
import { Solution } from '../interfaces/question.interface';
import { Snippet, SnippetRate } from '../interfaces/snippet.interface';
import { defaultAPIErrorHandle, defaultAPISuccessHandle } from '../util/error-util';

export interface SnippetsState {
  status: 'idle' | 'loading' | 'failed';
  snippets: Snippet[];
  selected: number;
  selectedRater?: string;
  raters: string[];
}

const initialState: SnippetsState = {
  status: 'idle',
  snippets: [],
  selected: 0,
  selectedRater: undefined,
  raters: [],
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
  async ({
    snippetId,
    rate,
    nextSnippet,
    successfulMsg,
    completeDatasetId,
  }: {
    snippetId: number,
    rate: SnippetRate,
    nextSnippet?: number,
    successfulMsg?: string,
    completeDatasetId?: number,
  }, { dispatch }) => {
    try {
      await api.rateSnippet(snippetId, rate);
      if (successfulMsg)
        defaultAPISuccessHandle(successfulMsg, dispatch);
      if (completeDatasetId)
        await api.completeRatingInProlific(completeDatasetId);
    } catch (error: any) {
      defaultAPIErrorHandle(error, dispatch);
      throw error;
    }
    return { snippetId, rate, nextSnippet };
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
          value: 0,
          comment: undefined,
        };
        switch (action.payload.key) {
          case 'comment':
            rate.comment = action.payload.value;
            break;
          case 'rate':
            rate.value = action.payload.value;
            break;
          default:
            break;
        }

        state.snippets[state.selected].rate = rate;
      }
    },

    updateQuestionSolution: (state, action: PayloadAction<{ questionIndex: number, solution: Solution }>) => {
      const {
        questionIndex,
        solution,
      } = action.payload;

      const snippet = state.snippets[state.selected];
      if (!snippet || !snippet.questions || questionIndex > snippet.questions.length - 1) {
        return;
      }
      snippet.questions[questionIndex].solution = solution;
    },

    chooseRater: (state, action: PayloadAction<string | undefined>) => {
      state.selectedRater = action.payload;
    },
    setRaters: (state, action: PayloadAction<string[]>) => {
      state.raters = action.payload;
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
        const {
          snippetId,
          rate,
          nextSnippet,
        } = action.payload;
        state.snippets.forEach(snippet => {
          if (snippet.id === snippetId)
            snippet.rate = rate;
        });

        if (nextSnippet !== undefined)
          state.selected = nextSnippet;
      })
      .addCase(rateSnippetAsync.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const {
  chooseSnippet,
  updateCurrentRateByKey,
  updateQuestionSolution,

  chooseRater,
  setRaters,
} = snippetsSlice.actions;

export const selectSnippetsState = (state: RootState) => state.snippets;

export default snippetsSlice.reducer;
