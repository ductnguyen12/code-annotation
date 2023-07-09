import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';

export interface SnippetPageState {
  code: string;
}

const initialState: SnippetPageState = {
  // TODO: Update later
  code: `
  void message_queue::submit_item(std::unique_ptr<message_queue::work_item> item) {
    if (!_pending.push(item.get())) {
        throw std::bad_alloc();
    }
    item.release();
    _pending.maybe_wakeup();
    ++_sent.value;
  }
  `,
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
