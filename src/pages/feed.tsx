import { FeedStats } from '@components/feed-stats/feed-stats';
import { OrderList } from '@components/order-list/order-list';
import { useGetFeedQuery } from '@services/feed/api';

import styles from './feed.module.css';

export const FeedPage = (): React.JSX.Element => {
  const { data } = useGetFeedQuery();

  return (
    <section className={styles.feed}>
      <h1 className="text text_type_main-large mt-10 mb-5">Лента заказов</h1>
      <div className={styles.content}>
        <div className={`${styles.orders} pr-2`}>
          <OrderList
            orders={data?.orders ?? []}
            isLoaded={Boolean(data?.isLoaded)}
            linkPrefix="/feed"
          />
        </div>
        <FeedStats
          orders={data?.orders ?? []}
          total={data?.total ?? 0}
          totalToday={data?.totalToday ?? 0}
        />
      </div>
    </section>
  );
};
