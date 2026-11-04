import type { TRootState } from '@services/store';
import type { TUser } from '@utils/types';

export const selectUser = (state: TRootState): TUser | null => state.user.user;

export const selectIsAuthChecked = (state: TRootState): boolean =>
  state.user.isAuthChecked;

export const selectIsForgotPasswordVisited = (state: TRootState): boolean =>
  state.user.isForgotPasswordVisited;
