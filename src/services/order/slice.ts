import { createSlice } from '@reduxjs/toolkit';

import { api } from '@services/api';

export type TOrderState = {
  number: number | null;
  isModalOpen: boolean;
  error: string | null;
};

const initialState: TOrderState = {
  number: null,
  isModalOpen: false,
  error: null,
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    closeOrderModal: (state): void => {
      state.isModalOpen = false;
      state.number = null;
    },
    clearOrderError: (state): void => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(api.endpoints.createOrder.matchPending, (state): void => {
        state.error = null;
      })
      .addMatcher(api.endpoints.createOrder.matchFulfilled, (state, action): void => {
        state.number = action.payload.order.number;
        state.isModalOpen = true;
        state.error = null;
      })
      .addMatcher(api.endpoints.createOrder.matchRejected, (state): void => {
        state.number = null;
        state.isModalOpen = false;
        state.error = 'Не удалось оформить заказ. Попробуйте ещё раз.';
      });
  },
});

export const { clearOrderError, closeOrderModal } = orderSlice.actions;

export const orderReducer = orderSlice.reducer;
