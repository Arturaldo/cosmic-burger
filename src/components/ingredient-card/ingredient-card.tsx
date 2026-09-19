import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useRef } from 'react';
import { useDrag } from 'react-dnd';

import { useAppDispatch } from '@services/hooks';
import { setViewedIngredient } from '@services/ingredient-details/slice';
import { DND_TYPES } from '@utils/constants';

import type { TDragItem, TIngredient } from '@utils/types';

import styles from './ingredient-card.module.css';

type TIngredientCardProps = {
  ingredient: TIngredient;
  count: number;
};

export const IngredientCard = ({
  ingredient,
  count,
}: TIngredientCardProps): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const cardRef = useRef<HTMLElement>(null);

  const [{ isDragging }, dragRef] = useDrag<TDragItem, unknown, { isDragging: boolean }>(
    () => ({
      type: DND_TYPES.INGREDIENT,
      item: { ingredient },
      collect: (monitor): { isDragging: boolean } => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [ingredient]
  );

  dragRef(cardRef);

  const handleClick = useCallback((): void => {
    dispatch(setViewedIngredient(ingredient));
  }, [dispatch, ingredient]);

  return (
    <article
      ref={cardRef}
      className={styles.ingredient_card}
      style={{ opacity: isDragging ? 0.4 : 1 }}
      onClick={handleClick}
    >
      {count > 0 && <Counter count={count} size="default" />}
      <img
        className={styles.ingredient_image}
        src={ingredient.image}
        alt={ingredient.name}
      />
      <div className={styles.ingredient_price}>
        <p className="text text_type_digits-default mr-2">{ingredient.price}</p>
        <CurrencyIcon type="primary" />
      </div>
      <p className={`${styles.ingredient_name} text text_type_main-default`}>
        {ingredient.name}
      </p>
    </article>
  );
};
