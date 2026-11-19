import {
  CurrencyIcon,
  FormattedDate,
} from '@krgaa/react-developer-burger-ui-components';
import { useMemo } from 'react';

import { useGetIngredientsQuery } from '@services/api';
import {
  getIngredientsById,
  getOrderIngredients,
  getOrderPrice,
  ORDER_STATUS_LABELS,
} from '@utils/orders';

import type { TIngredient, TOrder } from '@utils/types';

import styles from './order-info.module.css';

type TOrderInfoProps = {
  order: TOrder;
};

type TOrderLine = {
  ingredient: TIngredient;
  count: number;
};

export const OrderInfo = ({ order }: TOrderInfoProps): React.JSX.Element => {
  const { data: ingredients = [] } = useGetIngredientsQuery();

  const { lines, price } = useMemo(() => {
    const orderIngredients = getOrderIngredients(order, getIngredientsById(ingredients));
    const counts = new Map<string, TOrderLine>();

    orderIngredients.forEach((ingredient): void => {
      const line = counts.get(ingredient._id);

      if (line) {
        line.count += 1;
      } else {
        counts.set(ingredient._id, { ingredient, count: 1 });
      }
    });

    return { lines: [...counts.values()], price: getOrderPrice(orderIngredients) };
  }, [ingredients, order]);

  return (
    <div className={styles.info}>
      <h3 className="text text_type_main-medium">{order.name}</h3>
      <p
        className={`text text_type_main-default mt-3 ${
          order.status === 'done' ? styles.done : ''
        }`}
      >
        {ORDER_STATUS_LABELS[order.status]}
      </p>
      <h4 className="text text_type_main-medium mt-15 mb-6">Состав:</h4>
      <ul className={styles.list}>
        {lines.map(({ ingredient, count }) => (
          <li key={ingredient._id} className={styles.line}>
            <div className={styles.icon}>
              <img
                className={styles.image}
                src={ingredient.image_mobile}
                alt={ingredient.name}
              />
            </div>
            <p className={`${styles.name} text text_type_main-default`}>
              {ingredient.name}
            </p>
            <div className={styles.price}>
              <span className="text text_type_digits-default">
                {count} x {ingredient.price}
              </span>
              <CurrencyIcon type="primary" />
            </div>
          </li>
        ))}
      </ul>
      <div className={`${styles.footer} mt-10`}>
        <span className="text text_type_main-default text_color_inactive">
          <FormattedDate date={new Date(order.createdAt)} />
        </span>
        <div className={styles.price}>
          <span className="text text_type_digits-default">{price}</span>
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </div>
  );
};
