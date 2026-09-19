import type { TOrderState } from '@services/order/slice';

type TStateWithOrder = { order: TOrderState };

export const selectOrderNumber = (state: TStateWithOrder): number | null =>
  state.order.number;

export const selectIsOrderModalOpen = (state: TStateWithOrder): boolean =>
  state.order.isModalOpen;

export const selectOrderError = (state: TStateWithOrder): string | null =>
  state.order.error;
