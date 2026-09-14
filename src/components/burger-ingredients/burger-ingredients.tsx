import { Counter, CurrencyIcon, Tab } from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useMemo, useState } from 'react';

import type { TIngredient, TIngredientType } from '@utils/types';

import styles from './burger-ingredients.module.css';

type TCategoryTab = {
  value: TIngredientType;
  title: string;
};

const CATEGORY_TABS: TCategoryTab[] = [
  { value: 'bun', title: 'Булки' },
  { value: 'sauce', title: 'Соусы' },
  { value: 'main', title: 'Начинки' },
];

type TBurgerIngredientsProps = {
  ingredients: TIngredient[];
  counts: Map<string, number>;
  onIngredientClick: (ingredient: TIngredient) => void;
};

export const BurgerIngredients = ({
  ingredients,
  counts,
  onIngredientClick,
}: TBurgerIngredientsProps): React.JSX.Element => {
  const [currentTab, setCurrentTab] = useState<TIngredientType>('bun');

  const groupedIngredients = useMemo(
    (): Record<TIngredientType, TIngredient[]> => ({
      bun: ingredients.filter((ingredient) => ingredient.type === 'bun'),
      sauce: ingredients.filter((ingredient) => ingredient.type === 'sauce'),
      main: ingredients.filter((ingredient) => ingredient.type === 'main'),
    }),
    [ingredients]
  );

  const handleTabClick = useCallback((value: string): void => {
    const category = CATEGORY_TABS.find((tab) => tab.value === value);

    if (category) {
      setCurrentTab(category.value);
    }
  }, []);

  return (
    <section className={styles.burger_ingredients} aria-label="Список ингредиентов">
      <nav className={`${styles.tabs} mt-10 mb-10`}>
        {CATEGORY_TABS.map((tab) => (
          <Tab
            key={tab.value}
            value={tab.value}
            active={currentTab === tab.value}
            onClick={handleTabClick}
          >
            {tab.title}
          </Tab>
        ))}
      </nav>
      <div className={`${styles.ingredients_scroll} custom-scroll`}>
        {CATEGORY_TABS.map((tab) => (
          <section key={tab.value} className={styles.category}>
            <h2 className={`${styles.category_title} text text_type_main-medium`}>
              {tab.title}
            </h2>
            <ul className={styles.category_list}>
              {groupedIngredients[tab.value].map((ingredient) => {
                const count = counts.get(ingredient._id) ?? 0;

                return (
                  <li key={ingredient._id}>
                    <article
                      className={styles.ingredient_card}
                      onClick={(): void => onIngredientClick(ingredient)}
                    >
                      {count > 0 && <Counter count={count} size="default" />}
                      <img
                        className={styles.ingredient_image}
                        src={ingredient.image}
                        alt={ingredient.name}
                      />
                      <div className={styles.ingredient_price}>
                        <p className="text text_type_digits-default mr-2">
                          {ingredient.price}
                        </p>
                        <CurrencyIcon type="primary" />
                      </div>
                      <p
                        className={`${styles.ingredient_name} text text_type_main-default`}
                      >
                        {ingredient.name}
                      </p>
                    </article>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
};
