export type TIngredientType = 'bun' | 'main' | 'sauce';

export type TIngredient = {
  _id: string;
  name: string;
  type: TIngredientType;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
  __v: number;
};

/** Ингредиент внутри конструктора: uid отличает одинаковые ингредиенты друг от друга. */
export type TConstructorIngredient = TIngredient & {
  uid: string;
};

export type TIngredientsResponse = {
  success: boolean;
  data: TIngredient[];
};

export type TOrderResponse = {
  success: boolean;
  name: string;
  order: {
    number: number;
  };
};

export type TDragItem = {
  ingredient: TIngredient;
};

export type TSortItem = {
  uid: string;
  index: number;
};
