import { createSlice, nanoid } from '@reduxjs/toolkit';

import { api } from '@services/api';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { TConstructorIngredient, TIngredient } from '@utils/types';

export type TBurgerConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: TBurgerConstructorState = {
  bun: null,
  ingredients: [],
};

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>): void => {
        if (action.payload.type === 'bun') {
          // Булка не добавляется в список, а заменяет текущую.
          state.bun = action.payload;

          return;
        }

        state.ingredients.push(action.payload);
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, uid: nanoid() },
      }),
    },
    removeIngredient: (state, action: PayloadAction<string>): void => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.uid !== action.payload
      );
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ): void => {
      const { fromIndex, toIndex } = action.payload;
      const [moved] = state.ingredients.splice(fromIndex, 1);

      if (moved) {
        state.ingredients.splice(toIndex, 0, moved);
      }
    },
    clearConstructor: (): TBurgerConstructorState => initialState,
  },
  extraReducers: (builder) => {
    // После успешного заказа конструктор очищается.
    builder.addMatcher(
      api.endpoints.createOrder.matchFulfilled,
      (): TBurgerConstructorState => initialState
    );
  },
});

export const { addIngredient, clearConstructor, moveIngredient, removeIngredient } =
  burgerConstructorSlice.actions;

export const burgerConstructorReducer = burgerConstructorSlice.reducer;
