import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { useGetIngredientsQuery } from '@services/api';

import type { TIngredient } from '@utils/types';

import styles from './ingredient.module.css';

/** Страница ингредиента при прямом переходе по ссылке /ingredients/:id. */
export const IngredientPage = (): React.JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const { data: ingredients = [], isError, isLoading } = useGetIngredientsQuery();

  const ingredient = useMemo(
    (): TIngredient | undefined => ingredients.find((item): boolean => item._id === id),
    [id, ingredients]
  );

  return (
    <section className={styles.ingredient_page}>
      <h1 className="text text_type_main-large mt-10 mb-5">Детали ингредиента</h1>
      {isLoading && (
        <div className={styles.status}>
          <Preloader />
        </div>
      )}
      {isError && (
        <div className={styles.status}>
          <p className="text text_type_main-medium">
            Не удалось загрузить ингредиент. Обновите страницу.
          </p>
        </div>
      )}
      {!isLoading && !isError && (
        <div className={styles.status}>
          {ingredient ? (
            <IngredientDetails ingredient={ingredient} />
          ) : (
            <p className="text text_type_main-medium">Ингредиент не найден.</p>
          )}
        </div>
      )}
    </section>
  );
};
