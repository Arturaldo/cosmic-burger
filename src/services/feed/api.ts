import { api } from '@services/api';
import { ACCESS_TOKEN_COOKIE, WS_BASE_URL } from '@utils/constants';
import { getCookie } from '@utils/cookies';

import type {
  TOrder,
  TOrdersByNumberResponse,
  TOrdersFeed,
  TOrdersSocketMessage,
} from '@utils/types';

const RECONNECT_DELAY = 3000;

const emptyFeed: TOrdersFeed = { orders: [], total: 0, totalToday: 0, isLoaded: false };

const isTokenError = (message: TOrdersSocketMessage): boolean =>
  !message.success && /token/i.test(message.message ?? '');

const parseMessage = (data: unknown): TOrdersSocketMessage | null => {
  try {
    return JSON.parse(String(data)) as TOrdersSocketMessage;
  } catch {
    return null;
  }
};

type TStreamOptions = {
  getUrl: () => string | null;
  onTokenError?: () => Promise<void>;
  updateCachedData: (recipe: (draft: TOrdersFeed) => void) => void;
  cacheDataLoaded: Promise<unknown>;
  cacheEntryRemoved: Promise<unknown>;
};

const streamOrders = async ({
  getUrl,
  onTokenError,
  updateCachedData,
  cacheDataLoaded,
  cacheEntryRemoved,
}: TStreamOptions): Promise<void> => {
  await cacheDataLoaded;

  const current: { socket: WebSocket | null } = { socket: null };
  let isClosedByUs = false;
  let isRefreshing = false;
  let reconnectTimer: ReturnType<typeof setTimeout> | undefined;

  const refreshAndConnect = (): void => {
    if (!onTokenError || isRefreshing) {
      return;
    }

    isRefreshing = true;
    onTokenError()
      .catch((): void => undefined)
      .finally((): void => {
        if (!isClosedByUs && getUrl()) {
          connect();
        }
      });
  };

  const connect = (): void => {
    if (isClosedByUs) {
      return;
    }

    const url = getUrl();

    if (!url) {
      refreshAndConnect();
      return;
    }

    const currentSocket = new WebSocket(url);
    current.socket = currentSocket;

    currentSocket.onmessage = (event: MessageEvent): void => {
      const message = parseMessage(event.data);

      if (!message) {
        return;
      }

      if (isTokenError(message)) {
        currentSocket.onclose = null;
        currentSocket.close();
        refreshAndConnect();
        return;
      }

      if (message.success) {
        isRefreshing = false;
        updateCachedData((draft): void => {
          draft.orders = message.orders ?? [];
          draft.total = message.total ?? 0;
          draft.totalToday = message.totalToday ?? 0;
          draft.isLoaded = true;
        });
      }
    };

    currentSocket.onclose = (): void => {
      if (!isClosedByUs) {
        reconnectTimer = setTimeout(connect, RECONNECT_DELAY);
      }
    };
  };

  connect();

  await cacheEntryRemoved;

  isClosedByUs = true;
  clearTimeout(reconnectTimer);
  current.socket?.close();
};

export const feedApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getFeed: builder.query<TOrdersFeed, void>({
      queryFn: () => ({ data: emptyFeed }),
      keepUnusedDataFor: 0,
      onCacheEntryAdded: async (_arg, lifecycle): Promise<void> => {
        await streamOrders({
          getUrl: () => `${WS_BASE_URL}/orders/all`,
          updateCachedData: (recipe): void => {
            lifecycle.updateCachedData(recipe);
          },
          cacheDataLoaded: lifecycle.cacheDataLoaded,
          cacheEntryRemoved: lifecycle.cacheEntryRemoved,
        });
      },
    }),
    getProfileOrders: builder.query<TOrdersFeed, void>({
      queryFn: () => ({ data: emptyFeed }),
      keepUnusedDataFor: 0,
      onCacheEntryAdded: async (_arg, lifecycle): Promise<void> => {
        // getUser проходит через baseQueryWithReauth и обновляет просроченные токены
        const refreshTokens = async (): Promise<void> => {
          const request = lifecycle.dispatch(
            api.endpoints.getUser.initiate(undefined, { forceRefetch: true })
          );

          await request;
          request.unsubscribe();
        };

        const getUrl = (): string | null => {
          const accessToken = getCookie(ACCESS_TOKEN_COOKIE);

          return accessToken
            ? `${WS_BASE_URL}/orders?token=${accessToken.replace('Bearer ', '')}`
            : null;
        };

        await streamOrders({
          getUrl,
          onTokenError: refreshTokens,
          updateCachedData: (recipe): void => {
            lifecycle.updateCachedData(recipe);
          },
          cacheDataLoaded: lifecycle.cacheDataLoaded,
          cacheEntryRemoved: lifecycle.cacheEntryRemoved,
        });
      },
    }),
    getOrderByNumber: builder.query<TOrder | undefined, number>({
      query: (number) => `/orders/${number}`,
      transformResponse: (response: TOrdersByNumberResponse): TOrder | undefined =>
        response.orders[0],
    }),
  }),
});

export const { useGetFeedQuery, useGetOrderByNumberQuery, useGetProfileOrdersQuery } =
  feedApi;
