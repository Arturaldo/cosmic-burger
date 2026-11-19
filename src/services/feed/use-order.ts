import { useLocation } from 'react-router-dom';

import {
  useGetFeedQuery,
  useGetOrderByNumberQuery,
  useGetProfileOrdersQuery,
} from '@services/feed/api';

import type { TLocationState, TOrder } from '@utils/types';

type TUseOrderResult = {
  order: TOrder | undefined;
  isLoading: boolean;
};

export const useOrder = (number: number): TUseOrderResult => {
  const location = useLocation();
  const isProfileOrder = location.pathname.startsWith('/profile');
  const stateOrder = (location.state as TLocationState | null)?.order;

  const feed = useGetFeedQuery(undefined, { skip: isProfileOrder });
  const profileOrders = useGetProfileOrdersQuery(undefined, { skip: !isProfileOrder });
  const source = isProfileOrder ? profileOrders.data : feed.data;

  const cachedOrder =
    stateOrder ?? source?.orders.find((item): boolean => item.number === number);

  const fetched = useGetOrderByNumberQuery(number, { skip: Boolean(cachedOrder) });

  return {
    order: cachedOrder ?? fetched.data,
    isLoading: !cachedOrder && (fetched.isLoading || !source?.isLoaded),
  };
};
