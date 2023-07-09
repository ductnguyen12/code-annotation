import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface AppState {
  title: string;
}

const initialState: AppState = {
  title: 'Home',
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    changeTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
  },
});

export const { changeTitle } = appSlice.actions;

export const selectTitle = (state: RootState) => state.app.title;

export default appSlice.reducer;
