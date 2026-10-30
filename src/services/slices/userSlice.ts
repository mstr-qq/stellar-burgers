import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import {
  loginUserApi,
  registerUserApi,
  getUserApi,
  logoutApi,
  updateUserApi,
  type TLoginData,
  type TRegisterData,
} from '../../utils/burger-api';
import type { RootState } from '../store';
import type { TUser } from '@utils-types';
import { setCookie, deleteCookie } from '../../utils/cookie';

interface UserState {
  isAuthChecked: boolean;
  data: TUser | null;
  error: string | null;
  loading: boolean;
  updateUserRequest: boolean;
  updateUserError: string | null;
}

const initialState: UserState = {
  isAuthChecked: false,
  data: null,
  error: null,
  loading: false,
  updateUserRequest: false,
  updateUserError: null,
};

export const checkUserAuth = createAsyncThunk<TUser, void, { rejectValue: string }>(
  'user/checkUserAuth',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getUserApi();
      return res.user;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Пользователь не авторизован';
      return rejectWithValue(message);
    }
  }
);

export const registerUser = createAsyncThunk<
  TUser,
  TRegisterData,
  { rejectValue: string }
>('user/registerUser', async (data, { rejectWithValue }) => {
  try {
    const res = await registerUserApi(data);
    if (res.success) {
      localStorage.setItem('refreshToken', res.refreshToken);
      setCookie('accessToken', res.accessToken);
      return res.user;
    }
    return rejectWithValue('Ошибка регистрации');
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Ошибка регистрации';
    return rejectWithValue(message);
  }
});

export const loginUser = createAsyncThunk<TUser, TLoginData, { rejectValue: string }>(
  'user/loginUser',
  async (data, { rejectWithValue }) => {
    try {
      const res = await loginUserApi(data);
      if (res.success) {
        localStorage.setItem('refreshToken', res.refreshToken);
        setCookie('accessToken', res.accessToken);
        return res.user;
      }
      return rejectWithValue('Неверный логин или пароль');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Ошибка авторизации';
      return rejectWithValue(message);
    }
  }
);

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'user/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      const res = await logoutApi();
      if (res.success) {
        localStorage.removeItem('refreshToken');
        deleteCookie('accessToken');
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Ошибка при выходе из аккаунта';
      return rejectWithValue(message);
    }
  }
);

export const updateUser = createAsyncThunk<
  TUser,
  Partial<TRegisterData>,
  { rejectValue: string }
>('user/updateUser', async (data, { rejectWithValue }) => {
  try {
    const res = await updateUserApi(data);
    if (res.success) {
      return res.user;
    }
    return rejectWithValue('Ошибка обновления профиля');
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Ошибка обновления профиля';
    return rejectWithValue(message);
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
    clearUpdateUserError: (state) => {
      state.updateUserError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkUserAuth.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.data = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.data = null;
        state.isAuthChecked = true;
      })

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Ошибка входа';
      })

      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Ошибка регистрации';
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.data = null;
      })

      .addCase(updateUser.pending, (state) => {
        state.updateUserRequest = true;
        state.updateUserError = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.updateUserRequest = false;
        state.data = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updateUserRequest = false;
        state.updateUserError = action.payload ?? 'Ошибка обновления профиля';
      });
  },
});

export const selectUserData = (state: RootState) => state.user.data;
export const selectIsAuthChecked = (state: RootState) => state.user.isAuthChecked;
export const selectUserError = (state: RootState) => state.user.error;
export const selectUserLoading = (state: RootState) => state.user.loading;
export const selectUpdateUserRequest = (state: RootState) => state.user.updateUserRequest;
export const selectUpdateUserError = (state: RootState) => state.user.updateUserError;

export const { clearUserError, clearUpdateUserError } = userSlice.actions;
export default userSlice.reducer;