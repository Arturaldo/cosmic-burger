import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useMemo } from 'react';

import type { TIngredient } from '@utils/types';

import styles from './burger-constructor.module.css';

type TBurgerConstructorProps = {
  bun: TIngredient | null;
  fillings: TIngredient[];
  onOrderClick: () => void;
};

export const BurgerConstructor = ({
  bun,
  fillings,
  onOrderClick,
}: TBurgerConstructorProps): React.JSX.Element => {
  const totalPrice = useMemo((): number => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const fillingsPrice = fillings.reduce((total, filling) => total + filling.price, 0);

    return bunPrice + fillingsPrice;
  }, [bun, fillings]);

  const handleOrderClick = useCallback((): void => {
    onOrderClick();
  }, [onOrderClick]);

  return (
    <section className={styles.burger_constructor} aria-label="Конструктор бургера">
      {bun && (
        <ConstructorElement
          type="top"
          isLocked
          text={`${bun.name} (верх)`}
          price={bun.price}
          thumbnail={bun.image}
        />
      )}
      <div className={`${styles.fillings_list} custom-scroll`}>
        {fillings.map((filling) => (
          <div className={styles.filling_row} key={filling._id}>
            <DragIcon type="primary" />
            <ConstructorElement
              text={filling.name}
              price={filling.price}
              thumbnail={filling.image}
            />
          </div>
        ))}
      </div>
      {bun && (
        <ConstructorElement
          type="bottom"
          isLocked
          text={`${bun.name} (низ)`}
          price={bun.price}
          thumbnail={bun.image}
        />
      )}
      <footer className={styles.footer}>
        <div className={styles.total_price}>
          <p className="text text_type_digits-large mr-2">{totalPrice}</p>
          <CurrencyIcon type="primary" />
        </div>
        <Button type="primary" size="large" htmlType="button" onClick={handleOrderClick}>
          Оформить заказ
        </Button>
      </footer>
    </section>
  );
};
