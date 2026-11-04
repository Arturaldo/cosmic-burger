import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';
import { useGetIngredientsQuery } from '@services/api';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { selectIsOrderModalOpen } from '@services/order/selectors';
import { closeOrderModal } from '@services/order/slice';

import styles from './home.module.css';

export const HomePage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const { data: ingredients = [], isError, isLoading } = useGetIngredientsQuery();
  const isOrderModalOpen = useAppSelector(selectIsOrderModalOpen);

  const handleCloseOrderModal = useCallback((): void => {
    dispatch(closeOrderModal());
  }, [dispatch]);

  return (
    <div className={styles.home}>
      <h1 className="text text_type_main-large mt-10 mb-5">Соберите бургер</h1>
      {isLoading && (
        <div className={styles.status}>
          <Preloader />
        </div>
      )}
      {isError && (
        <div className={styles.status}>
          <p className="text text_type_main-medium">
            Не удалось загрузить ингредиенты. Обновите страницу.
          </p>
        </div>
      )}
      {!isLoading && !isError && (
        <DndProvider backend={HTML5Backend}>
          <div className={styles.content}>
            <BurgerIngredients ingredients={ingredients} />
            <BurgerConstructor />
          </div>
        </DndProvider>
      )}
      {isOrderModalOpen && (
        <Modal onClose={handleCloseOrderModal}>
          <OrderDetails />
        </Modal>
      )}
    </div>
  );
};
