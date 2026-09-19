import { CheckMarkIcon } from '@krgaa/react-developer-burger-ui-components';

import styles from './order-details.module.css';

const ORDER_NUMBER_TEST_DATA = '034536';

export const OrderDetails = (): React.JSX.Element => {
  return (
    <div className={styles.order_details}>
      <p className="text text_type_digits-large mt-4 mb-8">{ORDER_NUMBER_TEST_DATA}</p>
      <p className="text text_type_main-default mb-15">идентификатор заказа</p>
      <CheckMarkIcon type="success" />
      <p className="text text_type_main-default mt-15 mb-2">Ваш заказ начали готовить</p>
      <p className="text text_type_main-small text_color_inactive">
        Дождитесь готовности на орбитальной станции
      </p>
    </div>
  );
};
