import { Tab } from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { IngredientCard } from '@components/ingredient-card/ingredient-card';
import { selectIngredientCounts } from '@services/burger-constructor/selectors';
import { useAppSelector } from '@services/hooks';

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
};

export const BurgerIngredients = ({
  ingredients,
}: TBurgerIngredientsProps): React.JSX.Element => {
  const [currentTab, setCurrentTab] = useState<TIngredientType>('bun');
  const counts = useAppSelector(selectIngredientCounts);

  const scrollRef = useRef<HTMLDivElement>(null);
  const bunTitleRef = useRef<HTMLHeadingElement>(null);
  const sauceTitleRef = useRef<HTMLHeadingElement>(null);
  const mainTitleRef = useRef<HTMLHeadingElement>(null);

  const titleRefs = useMemo(
    (): Record<TIngredientType, React.RefObject<HTMLHeadingElement | null>> => ({
      bun: bunTitleRef,
      sauce: sauceTitleRef,
      main: mainTitleRef,
    }),
    []
  );

  const groupedIngredients = useMemo(
    (): Record<TIngredientType, TIngredient[]> => ({
      bun: ingredients.filter((ingredient) => ingredient.type === 'bun'),
      sauce: ingredients.filter((ingredient) => ingredient.type === 'sauce'),
      main: ingredients.filter((ingredient) => ingredient.type === 'main'),
    }),
    [ingredients]
  );

  /** Активен тот таб, чей заголовок ближе всего к верхней границе контейнера. */
  const updateActiveTab = useCallback((): void => {
    const container = scrollRef.current;

    if (!container) {
      return;
    }

    const containerTop = container.getBoundingClientRect().top;

    let closestTab: TIngredientType = CATEGORY_TABS[0].value;
    let minDistance = Number.POSITIVE_INFINITY;

    CATEGORY_TABS.forEach((tab) => {
      const title = titleRefs[tab.value].current;

      if (!title) {
        return;
      }

      const distance = Math.abs(title.getBoundingClientRect().top - containerTop);

      if (distance < minDistance) {
        minDistance = distance;
        closestTab = tab.value;
      }
    });

    setCurrentTab(closestTab);
  }, [titleRefs]);

  useEffect((): void => {
    updateActiveTab();
  }, [updateActiveTab, groupedIngredients]);

  const handleTabClick = useCallback(
    (value: string): void => {
      const category = CATEGORY_TABS.find((tab) => tab.value === value);

      if (category) {
        titleRefs[category.value].current?.scrollIntoView({ behavior: 'smooth' });
      }
    },
    [titleRefs]
  );

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
      <div
        ref={scrollRef}
        className={`${styles.ingredients_scroll} custom-scroll`}
        onScroll={updateActiveTab}
      >
        {CATEGORY_TABS.map((tab) => (
          <section key={tab.value} className={styles.category}>
            <h2
              ref={titleRefs[tab.value]}
              className={`${styles.category_title} text text_type_main-medium`}
            >
              {tab.title}
            </h2>
            <ul className={styles.category_list}>
              {groupedIngredients[tab.value].map((ingredient) => (
                <li key={ingredient._id}>
                  <IngredientCard
                    ingredient={ingredient}
                    count={counts[ingredient._id] ?? 0}
                  />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
};
