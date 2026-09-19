import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { TIngredient } from '@utils/types';

export type TIngredientDetailsState = {
  ingredient: TIngredient | null;
};

const initialState: TIngredientDetailsState = {
  ingredient: null,
};

export const ingredientDetailsSlice = createSlice({
  name: 'ingredientDetails',
  initialState,
  reducers: {
    setViewedIngredient: (state, action: PayloadAction<TIngredient>): void => {
      state.ingredient = action.payload;
    },
    clearViewedIngredient: (state): void => {
      state.ingredient = null;
    },
  },
});

export const { clearViewedIngredient, setViewedIngredient } =
  ingredientDetailsSlice.actions;

export const ingredientDetailsReducer = ingredientDetailsSlice.reducer;
