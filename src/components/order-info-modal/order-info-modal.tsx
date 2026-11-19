import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Modal } from '@components/modal/modal';
import { OrderInfo } from '@components/order-info/order-info';
import { useOrder } from '@services/feed/use-order';

export const OrderInfoModal = (): React.JSX.Element => {
  const navigate = useNavigate();
  const { number } = useParams<{ number: string }>();

  const { order } = useOrder(Number(number));

  const handleClose = useCallback((): void => {
    void navigate(-1);
  }, [navigate]);

  return (
    <Modal title={order ? `#${order.number}` : undefined} onClose={handleClose}>
      {order ? <OrderInfo order={order} /> : <Preloader />}
    </Modal>
  );
};
