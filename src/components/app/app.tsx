import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';
import { getIngredients } from '@utils/api';
import { FALLBACK_INGREDIENTS } from '@utils/fallback-ingredients';

import type { TBurgerComposition, TIngredient } from '@utils/types';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  const [ingredients, setIngredients] = useState<TIngredient[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeIngredient, setActiveIngredient] = useState<TIngredient | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState<boolean>(false);

  useEffect(() => {
    getIngredients()
      .then((data) => {
        setIngredients(data);
      })
      .catch(() => {
        console.warn('Сервер ингредиентов недоступен, показаны демо-данные');
        setIngredients(FALLBACK_INGREDIENTS);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const burgerComposition = useMemo((): TBurgerComposition => {
    const bun = ingredients.find((ingredient) => ingredient.type === 'bun') ?? null;
    const fillings = ingredients
      .filter((ingredient) => ingredient.type !== 'bun')
      .slice(0, 6);

    return { bun, fillings };
  }, [ingredients]);

  const ingredientCounts = useMemo((): Map<string, number> => {
    const counts = new Map<string, number>();
    const { bun, fillings } = burgerComposition;

    if (bun) {
      counts.set(bun._id, 2);
    }

    fillings.forEach((filling) => {
      counts.set(filling._id, (counts.get(filling._id) ?? 0) + 1);
    });

    return counts;
  }, [burgerComposition]);

  const openIngredientModal = useCallback((ingredient: TIngredient): void => {
    setActiveIngredient(ingredient);
  }, []);

  const closeIngredientModal = useCallback((): void => {
    setActiveIngredient(null);
  }, []);

  const openOrderModal = useCallback((): void => {
    setIsOrderModalOpen(true);
  }, []);

  const closeOrderModal = useCallback((): void => {
    setIsOrderModalOpen(false);
  }, []);

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
        {!isLoading && (
          <>
            <BurgerIngredients
              ingredients={ingredients}
              counts={ingredientCounts}
              onIngredientClick={openIngredientModal}
            />
            <BurgerConstructor
              bun={burgerComposition.bun}
              fillings={burgerComposition.fillings}
              onOrderClick={openOrderModal}
            />
          </>
        )}
      </main>
      {activeIngredient && (
        <Modal title="Детали ингредиента" onClose={closeIngredientModal}>
          <IngredientDetails ingredient={activeIngredient} />
        </Modal>
      )}
      {isOrderModalOpen && (
        <Modal onClose={closeOrderModal}>
          <OrderDetails />
        </Modal>
      )}
    </div>
  );
};

export default App;
