import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useCallback } from 'react';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';
import { useGetIngredientsQuery } from '@services/api';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { selectViewedIngredient } from '@services/ingredient-details/selectors';
import { clearViewedIngredient } from '@services/ingredient-details/slice';
import { selectIsOrderModalOpen } from '@services/order/selectors';
import { closeOrderModal } from '@services/order/slice';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const { data: ingredients = [], isError, isLoading } = useGetIngredientsQuery();

  const viewedIngredient = useAppSelector(selectViewedIngredient);
  const isOrderModalOpen = useAppSelector(selectIsOrderModalOpen);

  const closeIngredientModal = useCallback((): void => {
    dispatch(clearViewedIngredient());
  }, [dispatch]);

  const handleCloseOrderModal = useCallback((): void => {
    dispatch(closeOrderModal());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Соберите бургер
      </h1>
      <main className={`${styles.main} pl-5 pr-5`}>
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
          <>
            <BurgerIngredients ingredients={ingredients} />
            <BurgerConstructor />
          </>
        )}
      </main>
      {viewedIngredient && (
        <Modal title="Детали ингредиента" onClose={closeIngredientModal}>
          <IngredientDetails ingredient={viewedIngredient} />
        </Modal>
      )}
      {isOrderModalOpen && (
        <Modal onClose={handleCloseOrderModal}>
          <OrderDetails />
        </Modal>
      )}
    </div>
  );
};

export default App;
