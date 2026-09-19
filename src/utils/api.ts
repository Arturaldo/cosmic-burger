import type { TIngredient, TIngredientsResponse } from '@utils/types';

const API_BASE_URL = 'https://norma.nomoreparties.space/api';

const checkResponse = (response: Response): Promise<TIngredientsResponse> => {
  if (!response.ok) {
    return Promise.reject(new Error(`Ошибка запроса: ${response.status}`));
  }

  return response.json();
};

export const getIngredients = (): Promise<TIngredient[]> =>
  fetch(`${API_BASE_URL}/ingredients`)
    .then(checkResponse)
    .then((data) =>
      data.success
        ? data.data
        : Promise.reject(new Error('Не удалось получить данные об ингредиентах'))
    );
