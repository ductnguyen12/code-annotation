import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import api from '../api';
import { RootState } from '../app/store';
import { PatchRequest } from '../interfaces/common.interface';
import { QuestionPriority, Solution } from '../interfaces/question.interface';
import { Rater } from '../interfaces/rater.interface';
import { Snippet, SnippetQuestion, SnippetRate } from '../interfaces/snippet.interface';
import { defaultAPIErrorHandle, defaultAPISuccessHandle } from '../util/error-util';

export interface SnippetsState {
  status: 'idle' | 'loading' | 'failed';
  snippets: Snippet[];
  selected: number;
  selectedRater?: Rater;
  raters: Rater[];
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

export const createAttentionCheckSnippetAsync = createAsyncThunk(
  'snippets/createAttentionCheckSnippetAsync',
  async ({
    snippetId,
    onSuccess,
  }: {
    snippetId: number,
    onSuccess?: () => void,
  }, { dispatch }) => {
    try {
      await api.createAttentionCheckSnippet(snippetId);
      defaultAPISuccessHandle('Create attention check snippet successfully', dispatch);
      if (onSuccess)
        onSuccess();
    } catch (error: any) {
      defaultAPIErrorHandle(error, dispatch);
      throw error;
    }
  }
);

export const deleteSnippetAsync = createAsyncThunk(
  'snippets/deleteSnippetAsync',
  async ({
    snippetId,
    onSuccess,
  }: {
    snippetId: number,
    onSuccess?: () => void,
  }, { dispatch }) => {
    try {
      await api.deleteSnippet(snippetId);
      defaultAPISuccessHandle(`Delete snippet ${snippetId} successfully`, dispatch);
      if (onSuccess)
        onSuccess();
    } catch (error: any) {
      defaultAPIErrorHandle(error, dispatch);
      throw error;
    }
  }
);

export const createQuestionAsync = createAsyncThunk(
  'snippets/createQuestion',
  async ({ question, datasetId }: { question: SnippetQuestion, datasetId?: number }, { dispatch }) => {
    try {
      await api.createSnippetQuestion(question);
      defaultAPISuccessHandle('Create snippet question successfully', dispatch);
      if (datasetId)
        dispatch(loadDatasetSnippetsAsync(datasetId));
    } catch (error: any) {
      defaultAPIErrorHandle(error, dispatch);
      throw error;
    }
  }
);

export const reorderQuestionsAsync = createAsyncThunk(
  'snippets/reorderQuestionsAsync',
  async ({
    priority,
    onSuccess,
  }: {
    priority: QuestionPriority,
    onSuccess?: () => void,
  }, { dispatch }) => {
    try {
      await api.updateSnippetQuestionPriority(priority);
      defaultAPISuccessHandle('Reorder snippet questions successfully', dispatch);
      if (onSuccess)
        onSuccess();
    } catch (error: any) {
      defaultAPIErrorHandle(error, dispatch);
      throw error;
    }
  }
);

export const patchQuestionAsync = createAsyncThunk(
  'snippets/patchQuestionAsync',
  async ({
    questionId,
    request,
    onSuccess,
  }: {
    questionId: number,
    request: PatchRequest,
    onSuccess?: () => void,
  }, { dispatch }) => {
    try {
      const result = await api.patchSnippetQuestion(questionId, request);
      defaultAPISuccessHandle(`Update snippet question ID '${questionId}' successfully`, dispatch);
      onSuccess && onSuccess();
      return result;
    } catch (error: any) {
      defaultAPIErrorHandle(error, dispatch);
      throw error;
    }
  }
);

export const deleteQuestionAsync = createAsyncThunk(
  'snippets/deleteQuestion',
  async ({ questionId, datasetId }: { questionId: number, datasetId?: number }, { dispatch }) => {
    try {
      await api.deleteSnippetQuestion(questionId);
      defaultAPISuccessHandle(`Delete snippet question ID '${questionId}' successfully`, dispatch);
      if (datasetId)
        dispatch(loadDatasetSnippetsAsync(datasetId));
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
    onSuccess,
  }: {
    snippetId: number,
    rate: SnippetRate,
    nextSnippet?: number,
    successfulMsg?: string,
    onSuccess?: () => void,
  }, { dispatch }) => {
    try {
      await api.rateSnippet(snippetId, rate);
      if (!nextSnippet && nextSnippet !== 0 && successfulMsg)
        defaultAPISuccessHandle(successfulMsg, dispatch);
      if (onSuccess)
        onSuccess();
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
    setSnippets: (state, action: PayloadAction<Snippet[]>) => {
      state.snippets = action.payload;
    },
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

    chooseRater: (state, action: PayloadAction<Rater | undefined>) => {
      state.selectedRater = action.payload;
    },
    setRaters: (state, action: PayloadAction<Rater[]>) => {
      state.raters = action.payload;
      state.selectedRater = state.raters.find(r => r.id === state.selectedRater?.id);
      if (!state.selectedRater && state.raters.length > 0) {
        state.selectedRater = state.raters[0];
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

      .addCase(createAttentionCheckSnippetAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createAttentionCheckSnippetAsync.fulfilled, (state, action) => {
        state.status = 'idle';
      })
      .addCase(createAttentionCheckSnippetAsync.rejected, (state) => {
        state.status = 'failed';
      })

      .addCase(patchQuestionAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(patchQuestionAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        const snippetIndex = state.snippets.findIndex(s => action.payload.snippetId === s.id);
        if (snippetIndex === -1)
          return;
        const questionIndex = state.snippets[snippetIndex].questions?.findIndex(q => action.payload.id === q.id);
        if (questionIndex === undefined || questionIndex === -1)
          return;
        const newQuestions = [
          ...state.snippets[snippetIndex].questions?.slice(0, questionIndex) || [],
          action.payload,
          ...state.snippets[snippetIndex].questions?.slice(questionIndex + 1) || [],
        ]
        const newSnippet = {
          ...state.snippets[snippetIndex],
          questions: newQuestions,
        }
        state.snippets = [
          ...state.snippets.slice(0, snippetIndex),
          newSnippet,
          ...state.snippets.slice(snippetIndex + 1),
        ]
      })
      .addCase(patchQuestionAsync.rejected, (state) => {
        state.status = 'failed';
      })

      .addCase(deleteSnippetAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteSnippetAsync.fulfilled, (state, action) => {
        state.status = 'idle';
      })
      .addCase(deleteSnippetAsync.rejected, (state) => {
        state.status = 'failed';
      })

      .addCase(createQuestionAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createQuestionAsync.fulfilled, (state, action) => {
        state.status = 'idle';
      })
      .addCase(createQuestionAsync.rejected, (state) => {
        state.status = 'failed';
      })

      .addCase(deleteQuestionAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteQuestionAsync.fulfilled, (state, action) => {
        state.status = 'idle';
      })
      .addCase(deleteQuestionAsync.rejected, (state) => {
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
  setSnippets,
  chooseSnippet,
  updateCurrentRateByKey,
  updateQuestionSolution,

  chooseRater,
  setRaters,
} = snippetsSlice.actions;

export const selectSnippetsState = (state: RootState) => state.snippets;

export default snippetsSlice.reducer;
