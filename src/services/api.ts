import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { userLoggedOut } from '@services/user/actions';
import {
  ACCESS_TOKEN_COOKIE,
  API_BASE_URL,
  REFRESH_TOKEN_COOKIE,
} from '@utils/constants';
import { clearAuthCookies, getCookie, saveAuthTokens } from '@utils/cookies';

import type { SerializedError } from '@reduxjs/toolkit';
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import type {
  TAuthResponse,
  TForgotPasswordData,
  TIngredient,
  TIngredientsResponse,
  TLoginData,
  TLogoutResponse,
  TOrderResponse,
  TPasswordResetResponse,
  TRegisterData,
  TRefreshTokenResponse,
  TResetPasswordData,
  TUpdateUserData,
  TUserResponse,
} from '@utils/types';

/** Запросы, которые выполняются без заголовка authorization. */
const PUBLIC_URLS = [
  '/auth/login',
  '/auth/register',
  '/auth/token',
  '/auth/logout',
  '/ingredients',
  '/password-reset',
  '/password-reset/reset',
];

const isPublicUrl = (url: string): boolean => PUBLIC_URLS.includes(url);

/** Базовый запрос: закрытым запросам добавляет accessToken в поле authorization. */
const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { arg }): Headers => {
    const url = typeof arg === 'string' ? arg : arg.url;
    const accessToken = getCookie(ACCESS_TOKEN_COOKIE);

    if (accessToken && !isPublicUrl(url)) {
      headers.set('authorization', accessToken);
    }

    return headers;
  },
});

/**
 * Бэкенд отвечает 200 даже на логические ошибки, помечая их полем `success: false`.
 * Разворачиваем такой ответ в обычную ошибку RTK Query, чтобы хуки отдавали isError.
 */
const checkedBaseQuery: BaseQueryFn<
  FetchArgs | string,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQueryWithAuth(args, api, extraOptions);

  if (
    result.data !== null &&
    typeof result.data === 'object' &&
    'success' in result.data &&
    result.data.success === false
  ) {
    return {
      error: {
        status: 'CUSTOM_ERROR',
        data: result.data,
        error: 'Сервер вернул неуспешный ответ',
      },
      meta: result.meta,
    };
  }

  return result;
};

const isRefreshTokenResponse = (data: unknown): data is TRefreshTokenResponse =>
  typeof data === 'object' &&
  data !== null &&
  'accessToken' in data &&
  'refreshToken' in data;

/**
 * 401 — accessToken истёк, 403 — токен признан недействительным.
 * В обоих случаях пробуем обновить пару токенов через refreshToken
 * и повторяем исходный запрос.
 */
const isTokenRejected = (status: FetchBaseQueryError['status']): boolean =>
  status === 401 || status === 403;

const baseQueryWithReauth: BaseQueryFn<
  FetchArgs | string,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await checkedBaseQuery(args, api, extraOptions);

  if (result.error && isTokenRejected(result.error.status)) {
    const refreshToken = getCookie(REFRESH_TOKEN_COOKIE);

    if (refreshToken) {
      const refreshResult = await checkedBaseQuery(
        { url: '/auth/token', method: 'POST', body: { token: refreshToken } },
        api,
        extraOptions
      );

      if (refreshResult.data && isRefreshTokenResponse(refreshResult.data)) {
        saveAuthTokens(refreshResult.data.accessToken, refreshResult.data.refreshToken);

        // Повторяем запрос, который не прошёл из-за проблем с токеном.
        result = await checkedBaseQuery(args, api, extraOptions);
      } else {
        // Обновить токен не удалось — завершаем сессию.
        clearAuthCookies();
        api.dispatch(userLoggedOut());
      }
    }
  }

  return result;
};

/** Достаёт сообщение об ошибке из ответа API. */
export const getApiErrorMessage = (
  error: FetchBaseQueryError | SerializedError | undefined
): string | null => {
  if (error && 'data' in error) {
    const data = error.data as { message?: unknown } | undefined;

    if (data && typeof data.message === 'string') {
      return data.message;
    }
  }

  return null;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getIngredients: builder.query<TIngredient[], void>({
      query: () => '/ingredients',
      transformResponse: (response: TIngredientsResponse): TIngredient[] =>
        response.data,
    }),
    createOrder: builder.mutation<TOrderResponse, string[]>({
      query: (ingredients) => ({
        url: '/orders',
        method: 'POST',
        body: { ingredients },
      }),
    }),
    registerUser: builder.mutation<TAuthResponse, TRegisterData>({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
      // После успешной регистрации пользователь сразу считается авторизованным.
      async onQueryStarted(_body, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          saveAuthTokens(data.accessToken, data.refreshToken);
        } catch {
          // Ошибка доступна компоненту через состояние хука мутации.
        }
      },
    }),
    loginUser: builder.mutation<TAuthResponse, TLoginData>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
      async onQueryStarted(_body, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          saveAuthTokens(data.accessToken, data.refreshToken);
        } catch {
          // Ошибка доступна компоненту через состояние хука мутации.
        }
      },
    }),
    getUser: builder.query<TUserResponse, void>({
      query: () => '/auth/user',
    }),
    updateUser: builder.mutation<TUserResponse, TUpdateUserData>({
      query: (body) => ({
        url: '/auth/user',
        method: 'PATCH',
        body,
      }),
    }),
    logoutUser: builder.mutation<TLogoutResponse, void>({
      // Выход выполняется по refreshToken: сервер отзывает им сессию.
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
        body: { token: getCookie(REFRESH_TOKEN_COOKIE) },
      }),
    }),
    forgotPassword: builder.mutation<TPasswordResetResponse, TForgotPasswordData>({
      query: (body) => ({
        url: '/password-reset',
        method: 'POST',
        body,
      }),
    }),
    resetPassword: builder.mutation<TPasswordResetResponse, TResetPasswordData>({
      query: (body) => ({
        url: '/password-reset/reset',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useForgotPasswordMutation,
  useGetIngredientsQuery,
  useGetUserQuery,
  useLoginUserMutation,
  useLogoutUserMutation,
  useRegisterUserMutation,
  useResetPasswordMutation,
  useUpdateUserMutation,
} = api;
