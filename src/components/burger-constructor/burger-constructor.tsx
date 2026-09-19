import {
  Button,
  ConstructorElement,
  CurrencyIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useRef } from 'react';
import { useDrop } from 'react-dnd';

import { ConstructorIngredient } from '@components/constructor-ingredient/constructor-ingredient';
import { useCreateOrderMutation } from '@services/api';
import {
  selectConstructorBun,
  selectConstructorIngredients,
  selectOrderIngredientIds,
  selectTotalPrice,
} from '@services/burger-constructor/selectors';
import { addIngredient } from '@services/burger-constructor/slice';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { selectOrderError } from '@services/order/selectors';
import { DND_TYPES } from '@utils/constants';

import type { TDragItem } from '@utils/types';

import styles from './burger-constructor.module.css';

export const BurgerConstructor = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const bun = useAppSelector(selectConstructorBun);
  const ingredients = useAppSelector(selectConstructorIngredients);
  const totalPrice = useAppSelector(selectTotalPrice);
  const orderIngredientIds = useAppSelector(selectOrderIngredientIds);
  const orderError = useAppSelector(selectOrderError);

  const [createOrder, { isLoading: isOrderLoading }] = useCreateOrderMutation();

  const dropAreaRef = useRef<HTMLDivElement>(null);

  const [{ isOver }, dropRef] = useDrop<TDragItem, unknown, { isOver: boolean }>(() => ({
    accept: DND_TYPES.INGREDIENT,
    drop: (item): void => {
      dispatch(addIngredient(item.ingredient));
    },
    collect: (monitor): { isOver: boolean } => ({
      isOver: monitor.isOver(),
    }),
  }));

  dropRef(dropAreaRef);

  const handleOrderClick = useCallback((): void => {
    if (orderIngredientIds.length === 0) {
      return;
    }

    void createOrder(orderIngredientIds);
  }, [createOrder, orderIngredientIds]);

  return (
    <section className={styles.burger_constructor} aria-label="Конструктор бургера">
      <div
        ref={dropAreaRef}
        className={`${styles.drop_area} ${isOver ? styles.drop_area_hovered : ''}`}
      >
        {bun ? (
          <ConstructorElement
            type="top"
            isLocked
            text={`${bun.name} (верх)`}
            price={bun.price}
            thumbnail={bun.image}
          />
        ) : (
          <p
            className={`${styles.placeholder} ${styles.placeholder_bun} text text_type_main-default text_color_inactive`}
          >
            Перетащите булку
          </p>
        )}
        <ul className={`${styles.fillings_list} custom-scroll`}>
          {ingredients.length === 0 ? (
            <li
              className={`${styles.placeholder} ${styles.placeholder_filling} text text_type_main-default text_color_inactive`}
            >
              Перетащите начинку
            </li>
          ) : (
            ingredients.map((ingredient, index) => (
              <ConstructorIngredient
                key={ingredient.uid}
                ingredient={ingredient}
                index={index}
              />
            ))
          )}
        </ul>
        {bun ? (
          <ConstructorElement
            type="bottom"
            isLocked
            text={`${bun.name} (низ)`}
            price={bun.price}
            thumbnail={bun.image}
          />
        ) : (
          <p
            className={`${styles.placeholder} ${styles.placeholder_bun} text text_type_main-default text_color_inactive`}
          >
            Перетащите булку
          </p>
        )}
      </div>
      <footer className={styles.footer}>
        {orderError && (
          <p className={`${styles.error} text text_type_main-default`}>{orderError}</p>
        )}
        <div className={styles.total_price}>
          <p className="text text_type_digits-large mr-2">{totalPrice}</p>
          <CurrencyIcon type="primary" />
        </div>
        <Button
          type="primary"
          size="large"
          htmlType="button"
          disabled={!bun || isOrderLoading}
          onClick={handleOrderClick}
        >
          {isOrderLoading ? 'Оформляем...' : 'Оформить заказ'}
        </Button>
      </footer>
    </section>
  );
};
