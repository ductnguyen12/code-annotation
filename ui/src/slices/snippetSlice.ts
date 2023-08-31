import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';

export interface SnippetPageState {
  code: string;
}

const initialState: SnippetPageState = {
  code: '',
};

export const snippetPageSlice = createSlice({
  name: 'snippetPage',
  initialState,
  reducers: {
    loadSnippet: (state, action: PayloadAction<string>) => {
      state.code = action.payload;
    },
  },
});

export const { loadSnippet } = snippetPageSlice.actions;

export const selectCode = (state: RootState) => state.snippet.code;

export default snippetPageSlice.reducer;
