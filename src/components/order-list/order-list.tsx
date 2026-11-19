import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useMemo } from 'react';

import { OrderCard } from '@components/order-card/order-card';
import { useGetIngredientsQuery } from '@services/api';
import {
  getIngredientsById,
  getOrderIngredients,
  getOrderPrice,
  sortByNewest,
} from '@utils/orders';

import type { TOrder } from '@utils/types';

import styles from './order-list.module.css';

type TOrderListProps = {
  orders: TOrder[];
  isLoaded: boolean;
  linkPrefix: string;
  showStatus?: boolean;
};

export const OrderList = ({
  orders,
  isLoaded,
  linkPrefix,
  showStatus,
}: TOrderListProps): React.JSX.Element => {
  const { data: ingredients = [] } = useGetIngredientsQuery();

  const cards = useMemo(() => {
    const ingredientsById = getIngredientsById(ingredients);

    return sortByNewest(orders).map((order) => {
      const orderIngredients = getOrderIngredients(order, ingredientsById);

      return { order, orderIngredients, price: getOrderPrice(orderIngredients) };
    });
  }, [ingredients, orders]);

  if (!isLoaded || ingredients.length === 0) {
    return (
      <div className={styles.status}>
        <Preloader />
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <p className="text text_type_main-medium text_color_inactive">Заказов пока нет</p>
    );
  }

  return (
    <ul className={styles.list}>
      {cards.map(({ order, orderIngredients, price }) => (
        <li key={order._id}>
          <OrderCard
            order={order}
            ingredients={orderIngredients}
            price={price}
            linkPrefix={linkPrefix}
            showStatus={showStatus}
          />
        </li>
      ))}
    </ul>
  );
};
