import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

import { getIngredientsApi } from '../../utils/burger-api';

import type { RootState } from '../store';
import type { TIngredient } from '@utils-types';

type IngredientsState = {
  items: TIngredient[];
  loading: boolean;
  error: string | null;
};

const initialState: IngredientsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchIngredients = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: string }
>('ingredients/fetchIngredients', async (_, { rejectWithValue }) => {
  try {
    return await getIngredientsApi();
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Неизвестная ошибка при загрузке';
    return rejectWithValue(message);
  }
});

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    clearIngredients: (state): void => {
      state.items = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchIngredients.fulfilled,
        (state, action: PayloadAction<TIngredient[]>) => {
          state.loading = false;
          state.items = action.payload;
        }
      )
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Что-то пошло не так';
      });
  },
});

export const selectIngredients = (state: RootState): TIngredient[] =>
  state.ingredients.items;
export const selectIngredientsLoading = (state: RootState): boolean =>
  state.ingredients.loading;
export const selectIngredientsError = (state: RootState): string | null =>
  state.ingredients.error;

export const { clearIngredients } = ingredientsSlice.actions;
export default ingredientsSlice.reducer;
