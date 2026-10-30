import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { orderBurgerApi, getOrderByNumberApi } from '../../utils/burger-api';
import type { RootState } from '../store';
import type { TOrder } from '@utils-types';

interface OrderState {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  orderError: string | null;
  currentOrder: TOrder | null;
  currentOrderRequest: boolean;
  currentOrderError: string | null;
  ordersByNumber: Record<number, TOrder>;
}

const initialState: OrderState = {
  orderRequest: false,
  orderModalData: null,
  orderError: null,
  currentOrder: null,
  currentOrderRequest: false,
  currentOrderError: null,
  ordersByNumber: {},
};

export const createOrder = createAsyncThunk<
  TOrder,
  string[],
  { rejectValue: string }
>('order/createOrder', async (ingredientIds, { rejectWithValue }) => {
  try {
    const data = await orderBurgerApi(ingredientIds);
    if (data.success) {
      return data.order;
    }
    return rejectWithValue('Не удалось оформить заказ');
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Ошибка при отправке заказа';
    return rejectWithValue(message);
  }
});

export const fetchOrderByNumber = createAsyncThunk<
  TOrder,
  number,
  { rejectValue: string }
>('order/fetchOrderByNumber', async (number, { rejectWithValue }) => {
  try {
    const res = await getOrderByNumberApi(number);
    if (res.success && res.orders.length > 0) {
      return res.orders[0];
    }
    return rejectWithValue('Заказ не найден');
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Ошибка загрузки заказа';
    return rejectWithValue(message);
  }
});

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrder: (state) => {
      state.orderModalData = null;
      state.orderRequest = false;
      state.orderError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.orderError = null;
      })
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<TOrder>) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
        state.ordersByNumber[action.payload.number] = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderError = action.payload ?? 'Что-то пошло не так';
      })

      .addCase(fetchOrderByNumber.pending, (state) => {
        state.currentOrderRequest = true;
        state.currentOrderError = null;
      })
      .addCase(
        fetchOrderByNumber.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.currentOrderRequest = false;
          state.currentOrder = action.payload;
          state.ordersByNumber[action.payload.number] = action.payload;
        }
      )
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.currentOrderRequest = false;
        state.currentOrderError = action.payload ?? 'Ошибка загрузки заказа';
      });
  },
});

export const selectOrderRequest = (state: RootState) => state.order.orderRequest;
export const selectOrderModalData = (state: RootState) => state.order.orderModalData;
export const selectOrderError = (state: RootState) => state.order.orderError;
export const selectCurrentOrder = (state: RootState) => state.order.currentOrder;
export const selectCurrentOrderRequest = (state: RootState) =>
  state.order.currentOrderRequest;
export const selectCurrentOrderError = (state: RootState) =>
  state.order.currentOrderError;
export const selectOrdersByNumber = (state: RootState) => state.order.ordersByNumber;

export const { resetOrder } = orderSlice.actions;
export default orderSlice.reducer;