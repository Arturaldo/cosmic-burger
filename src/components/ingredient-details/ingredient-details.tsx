import { InfoIcon } from '@krgaa/react-developer-burger-ui-components';
import { useMemo } from 'react';

import type { TIngredient } from '@utils/types';

import styles from './ingredient-details.module.css';

type TIngredientDetailsProps = {
  ingredient: TIngredient;
};

type TNutritionItem = {
  title: string;
  value: number;
};

export const IngredientDetails = ({
  ingredient,
}: TIngredientDetailsProps): React.JSX.Element => {
  const nutritionItems = useMemo(
    (): TNutritionItem[] => [
      { title: 'Калории,ккал', value: ingredient.calories },
      { title: 'Белки, г', value: ingredient.proteins },
      { title: 'Жиры, г', value: ingredient.fat },
      { title: 'Углеводы, г', value: ingredient.carbohydrates },
    ],
    [ingredient]
  );

  return (
    <div className={styles.ingredient_details}>
      <img
        className={styles.ingredient_image}
        src={ingredient.image_large}
        alt={ingredient.name}
      />
      <h3 className={`${styles.ingredient_name} text text_type_main-medium mt-4 mb-8`}>
        {ingredient.name}
      </h3>
      <div className={styles.nutrition_title_row}>
        <InfoIcon type="primary" />
        <p className="text text_type_main-default text_color_inactive">
          Значения питания
        </p>
      </div>
      <ul className={styles.nutrition_list}>
        {nutritionItems.map((item) => (
          <li key={item.title} className={styles.nutrition_item}>
            <p className="text text_type_main-default text_color_inactive mb-2">
              {item.title}
            </p>
            <p className="text text_type_digits-default">{item.value}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
