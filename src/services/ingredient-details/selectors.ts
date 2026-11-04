import type { TIngredientDetailsState } from '@services/ingredient-details/slice';
import type { TIngredient } from '@utils/types';

type TStateWithIngredientDetails = { ingredientDetails: TIngredientDetailsState };

export const selectViewedIngredient = (
  state: TStateWithIngredientDetails
): TIngredient | null => state.ingredientDetails.ingredient;
