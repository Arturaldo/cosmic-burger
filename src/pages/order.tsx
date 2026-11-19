import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useParams } from 'react-router-dom';

import { OrderInfo } from '@components/order-info/order-info';
import { useGetOrderByNumberQuery } from '@services/feed/api';

import styles from './order.module.css';

export const OrderPage = (): React.JSX.Element => {
  const { number } = useParams<{ number: string }>();
  const { data: order, isError, isLoading } = useGetOrderByNumberQuery(Number(number));

  return (
    <section className={styles.order_page}>
      {isLoading && <Preloader />}
      {(isError || (!isLoading && !order)) && (
        <p className="text text_type_main-medium">Заказ не найден.</p>
      )}
      {order && (
        <>
          <h1 className="text text_type_digits-default mb-10">#{order.number}</h1>
          <OrderInfo order={order} />
        </>
      )}
    </section>
  );
};
