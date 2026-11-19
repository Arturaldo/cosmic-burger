import { OrderList } from '@components/order-list/order-list';
import { useGetProfileOrdersQuery } from '@services/feed/api';

import styles from './profile-orders.module.css';

export const ProfileOrdersPage = (): React.JSX.Element => {
  const { data } = useGetProfileOrdersQuery();

  return (
    <section className={styles.orders} aria-label="История заказов">
      <OrderList
        orders={data?.orders ?? []}
        isLoaded={Boolean(data?.isLoaded)}
        linkPrefix="/profile/orders"
        showStatus
      />
    </section>
  );
};
