import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import api from '../api';
import { RootState } from '../app/store';
import { AccessToken, Login } from '../interfaces/auth.interface';
import { User } from '../interfaces/user.interface';
import { defaultAPIErrorHandle } from '../util/error-util';

export interface AuthState {
  status: 'idle' | 'loading' | 'failed';
  user: User | undefined;
  authenticated: boolean;
  expiredTime: number;
}

const initialState: AuthState = {
  status: 'idle',
  user: undefined,
  authenticated: false,
  expiredTime: 0,
};

export const signInAsync = createAsyncThunk(
  'auth/signIn',
  async (login: Login, { dispatch }) => {
    try {
      const token = await api.signIn(login);
      return [token, await api.getCurrentUser()];
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        defaultAPIErrorHandle(error, dispatch, 'Username or password is not correct');
      } else {
        defaultAPIErrorHandle(error, dispatch);
      }
      throw error;
    }
  }
);

export const getCurrentUserAsync = createAsyncThunk(
  'auth/getCurrentUser',
  async () => {
    return await api.getCurrentUser();
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(signInAsync.pending, (state) => {
        state.status = 'loading';
        state.user = undefined;
        state.authenticated = false;
        state.expiredTime = 0;
      })
      .addCase(signInAsync.fulfilled, (state, action: PayloadAction<(AccessToken | User)[]>) => {
        state.status = 'idle';
        const [user, token] = action.payload;
        state.user = user as User;
        state.authenticated = true;
        state.expiredTime = new Date().getTime() + (1000 * (token as AccessToken).expiresIn);
      })
      .addCase(signInAsync.rejected, (state) => {
        state.status = 'failed';
        state.user = undefined;
        state.authenticated = false;
        state.expiredTime = 0;
      })

      .addCase(getCurrentUserAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getCurrentUserAsync.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = 'idle';
        state.user = action.payload;
        state.authenticated = true;
      })
      .addCase(getCurrentUserAsync.rejected, (state) => {
        state.status = 'failed';
        state.user = undefined;
        state.authenticated = false;
      });;
  },
});

export const selectAuthState = (state: RootState) => state.auth;

export default authSlice.reducer;
