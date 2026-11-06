import type { Location } from 'react-router-dom';

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

export type TUser = {
  email: string;
  name: string;
};

export type TRegisterData = {
  name: string;
  email: string;
  password: string;
};

export type TLoginData = {
  email: string;
  password: string;
};

/** На сервер уходит только то, что пользователь действительно изменил. */
export type TUpdateUserData = {
  name?: string;
  email?: string;
  password?: string;
};

export type TAuthResponse = {
  success: boolean;
  user: TUser;
  accessToken: string;
  refreshToken: string;
};

export type TUserResponse = {
  success: boolean;
  user: TUser;
};

export type TRefreshTokenResponse = {
  success: boolean;
  accessToken: string;
  refreshToken: string;
};

export type TLogoutResponse = {
  success: boolean;
  message: string;
};

export type TForgotPasswordData = {
  email: string;
};

export type TResetPasswordData = {
  password: string;
  token: string;
};

export type TPasswordResetResponse = {
  success: boolean;
  message: string;
};

/** Служебное состояние location: фон под модальным окном и маршрут возврата. */
export type TLocationState = {
  background?: Location;
  from?: Location;
};
