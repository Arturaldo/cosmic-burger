import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { Modal } from '@components/modal/modal';
import { OrderInfo } from '@components/order-info/order-info';
import { useGetOrderByNumberQuery } from '@services/feed/api';

import type { TLocationState } from '@utils/types';

export const OrderInfoModal = (): React.JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const { number } = useParams<{ number: string }>();

  const stateOrder = (location.state as TLocationState | null)?.order;
  const { data: fetchedOrder } = useGetOrderByNumberQuery(Number(number), {
    skip: Boolean(stateOrder),
  });
  const order = stateOrder ?? fetchedOrder;

  const handleClose = useCallback((): void => {
    void navigate(-1);
  }, [navigate]);

  return (
    <Modal title={order ? `#${order.number}` : undefined} onClose={handleClose}>
      {order ? <OrderInfo order={order} /> : <Preloader />}
    </Modal>
  );
};
