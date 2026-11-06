import { combineReducers } from '@reduxjs/toolkit';

import { api } from '@services/api';
import { burgerConstructorReducer } from '@services/burger-constructor/slice';
import { ingredientDetailsReducer } from '@services/ingredient-details/slice';
import { orderReducer } from '@services/order/slice';
import { userReducer } from '@services/user/slice';

export const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  burgerConstructor: burgerConstructorReducer,
  ingredientDetails: ingredientDetailsReducer,
  order: orderReducer,
  user: userReducer,
});

/** Тип хранилища — на основе типа корневого редьюсера и ReturnType. */
export type TRootState = ReturnType<typeof rootReducer>;
