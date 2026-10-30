import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { getFeedsApi, getOrdersApi } from '../../utils/burger-api';
import type { RootState } from '../store';
import type { TOrder, TOrdersData, TFeedState } from '@utils-types';

interface FeedsState {
  feeds: TFeedState;
  userOrders: TOrder[];
  userOrdersLoading: boolean;
  userOrdersError: string | null;
}

const initialState: FeedsState = {
  feeds: {
    orders: [],
    total: 0,
    totalToday: 0,
    isLoading: false,
    error: null,
  },
  userOrders: [],
  userOrdersLoading: false,
  userOrdersError: null,
};

export const fetchFeeds = createAsyncThunk<
  TOrdersData,
  void,
  { rejectValue: string }
>('feeds/fetchFeeds', async (_, { rejectWithValue }) => {
  try {
    const data = await getFeedsApi();
    return {
      orders: data.orders,
      total: data.total,
      totalToday: data.totalToday,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Ошибка загрузки ленты';
    return rejectWithValue(message);
  }
});

export const fetchUserOrders = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('feeds/fetchUserOrders', async (_, { rejectWithValue }) => {
  try {
    return await getOrdersApi();
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Ошибка загрузки истории заказов';
    return rejectWithValue(message);
  }
});

const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.feeds.isLoading = true;
        state.feeds.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action: PayloadAction<TOrdersData>) => {
        state.feeds.isLoading = false;
        state.feeds.orders = action.payload.orders;
        state.feeds.total = action.payload.total;
        state.feeds.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.feeds.isLoading = false;
        state.feeds.error = action.payload ?? 'Ошибка загрузки ленты';
      })

      .addCase(fetchUserOrders.pending, (state) => {
        state.userOrdersLoading = true;
        state.userOrdersError = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action: PayloadAction<TOrder[]>) => {
        state.userOrdersLoading = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.userOrdersLoading = false;
        state.userOrdersError = action.payload ?? 'Ошибка загрузки истории';
      });
  },
});

export const selectFeeds = (state: RootState) => state.feeds.feeds;
export const selectFeedsOrders = (state: RootState) => state.feeds.feeds.orders;
export const selectFeedsTotal = (state: RootState) => state.feeds.feeds.total;
export const selectFeedsTotalToday = (state: RootState) => state.feeds.feeds.totalToday;
export const selectFeedsLoading = (state: RootState) => state.feeds.feeds.isLoading;
export const selectFeedsError = (state: RootState) => state.feeds.feeds.error;
export const selectUserOrders = (state: RootState) => state.feeds.userOrders;
export const selectUserOrdersLoading = (state: RootState) => state.feeds.userOrdersLoading;
export const selectUserOrdersError = (state: RootState) => state.feeds.userOrdersError;

export default feedsSlice.reducer;