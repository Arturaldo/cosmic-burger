import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { API_BASE_URL } from '@utils/constants';

import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import type { TIngredient, TIngredientsResponse, TOrderResponse } from '@utils/types';

const rawBaseQuery = fetchBaseQuery({ baseUrl: API_BASE_URL });

/**
 * Бэкенд отвечает 200 даже на логические ошибки, помечая их полем `success: false`.
 * Разворачиваем такой ответ в обычную ошибку RTK Query, чтобы хуки отдавали isError.
 */
const baseQuery: BaseQueryFn<FetchArgs | string, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  const result = await rawBaseQuery(args, api, extraOptions);

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

export const api = createApi({
  reducerPath: 'api',
  baseQuery,
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
  }),
});

export const { useCreateOrderMutation, useGetIngredientsQuery } = api;
