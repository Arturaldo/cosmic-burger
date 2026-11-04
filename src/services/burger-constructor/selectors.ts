import { createSelector } from '@reduxjs/toolkit';

import type { TBurgerConstructorState } from '@services/burger-constructor/slice';
import type { TConstructorIngredient, TIngredient } from '@utils/types';

type TStateWithConstructor = { burgerConstructor: TBurgerConstructorState };

export const selectConstructorBun = (state: TStateWithConstructor): TIngredient | null =>
  state.burgerConstructor.bun;

export const selectConstructorIngredients = (
  state: TStateWithConstructor
): TConstructorIngredient[] => state.burgerConstructor.ingredients;

/** Стоимость пересчитывается только при изменении состава конструктора. */
export const selectTotalPrice = createSelector(
  [selectConstructorBun, selectConstructorIngredients],
  (bun, ingredients): number => {
    const bunPrice = bun ? bun.price * 2 : 0;

    return ingredients.reduce((total, ingredient) => total + ingredient.price, bunPrice);
  }
);

/** Счётчики карточек: у булки всегда 2, у остальных — число вхождений. */
export const selectIngredientCounts = createSelector(
  [selectConstructorBun, selectConstructorIngredients],
  (bun, ingredients): Record<string, number> => {
    const counts: Record<string, number> = {};

    if (bun) {
      counts[bun._id] = 2;
    }

    ingredients.forEach((ingredient) => {
      counts[ingredient._id] = (counts[ingredient._id] ?? 0) + 1;
    });

    return counts;
  }
);

export const selectOrderIngredientIds = createSelector(
  [selectConstructorBun, selectConstructorIngredients],
  (bun, ingredients): string[] =>
    bun ? [bun._id, ...ingredients.map((ingredient) => ingredient._id), bun._id] : []
);
