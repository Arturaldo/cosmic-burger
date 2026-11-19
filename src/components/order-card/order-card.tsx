import {
  CurrencyIcon,
  FormattedDate,
} from '@krgaa/react-developer-burger-ui-components';
import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { ORDER_STATUS_LABELS } from '@utils/orders';

import type { TIngredient, TLocationState, TOrder } from '@utils/types';

import styles from './order-card.module.css';

const MAX_VISIBLE_ICONS = 6;

type TOrderCardProps = {
  order: TOrder;
  ingredients: TIngredient[];
  price: number;
  linkPrefix: string;
  showStatus?: boolean;
};

export const OrderCard = ({
  order,
  ingredients,
  price,
  linkPrefix,
  showStatus = false,
}: TOrderCardProps): React.JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = useCallback((): void => {
    void navigate(`${linkPrefix}/${order.number}`, {
      state: { background: location, order } satisfies TLocationState,
    });
  }, [linkPrefix, location, navigate, order]);

  const visibleIngredients = ingredients.slice(0, MAX_VISIBLE_ICONS);
  const hiddenCount = ingredients.length - visibleIngredients.length;

  return (
    <article className={`${styles.card} p-6`} onClick={handleClick}>
      <div className={styles.header}>
        <span className="text text_type_digits-default">#{order.number}</span>
        <span className="text text_type_main-default text_color_inactive">
          <FormattedDate date={new Date(order.createdAt)} />
        </span>
      </div>
      <h3 className="text text_type_main-medium mt-6">{order.name}</h3>
      {showStatus && (
        <p
          className={`text text_type_main-default mt-2 ${
            order.status === 'done' ? styles.done : ''
          }`}
        >
          {ORDER_STATUS_LABELS[order.status]}
        </p>
      )}
      <div className={`${styles.footer} mt-6`}>
        <ul className={styles.icons}>
          {visibleIngredients.map((item, index) => (
            <li
              key={`${item._id}-${index}`}
              className={styles.icon}
              style={{ zIndex: MAX_VISIBLE_ICONS - index }}
            >
              <img className={styles.image} src={item.image_mobile} alt={item.name} />
              {hiddenCount > 0 && index === MAX_VISIBLE_ICONS - 1 && (
                <span className={`${styles.more} text text_type_main-default`}>
                  +{hiddenCount}
                </span>
              )}
            </li>
          ))}
        </ul>
        <div className={styles.price}>
          <span className="text text_type_digits-default">{price}</span>
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </article>
  );
};
