import { createSlice } from '@reduxjs/toolkit';

import { api } from '@services/api';
import { userLoggedOut } from '@services/user/actions';
import { REFRESH_TOKEN_COOKIE } from '@utils/constants';
import { getCookie } from '@utils/cookies';

import type { TUser } from '@utils/types';

export type TUserState = {
  user: TUser | null;
  /** Завершилась ли первичная проверка авторизации при запуске приложения. */
  isAuthChecked: boolean;
  /** Пользователь уже запросил письмо для восстановления пароля. */
  isForgotPasswordVisited: boolean;
};

/**
 * Если refreshToken отсутствует, проверять нечего — пользователь точно
 * не авторизован. Иначе авторизация проверяется запросом getUser при старте.
 */
const initialState: TUserState = {
  user: null,
  isAuthChecked: !getCookie(REFRESH_TOKEN_COOKIE),
  isForgotPasswordVisited: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    forgotPasswordVisited: (state): void => {
      state.isForgotPasswordVisited = true;
    },
    resetPasswordCompleted: (state): void => {
      state.isForgotPasswordVisited = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userLoggedOut, (state): void => {
        state.user = null;
      })
      // Регистрация и вход сразу авторизуют пользователя.
      .addMatcher(api.endpoints.registerUser.matchFulfilled, (state, action): void => {
        state.user = action.payload.user;
        state.isAuthChecked = true;
      })
      .addMatcher(api.endpoints.loginUser.matchFulfilled, (state, action): void => {
        state.user = action.payload.user;
        state.isAuthChecked = true;
      })
      // Первичная проверка авторизации при запуске приложения.
      .addMatcher(api.endpoints.getUser.matchFulfilled, (state, action): void => {
        state.user = action.payload.user;
        state.isAuthChecked = true;
      })
      .addMatcher(api.endpoints.getUser.matchRejected, (state): void => {
        state.user = null;
        state.isAuthChecked = true;
      })
      .addMatcher(api.endpoints.updateUser.matchFulfilled, (state, action): void => {
        state.user = action.payload.user;
      })
      .addMatcher(api.endpoints.logoutUser.matchFulfilled, (state): void => {
        state.user = null;
      });
  },
});

export const { forgotPasswordVisited, resetPasswordCompleted } = userSlice.actions;

export const userReducer = userSlice.reducer;
