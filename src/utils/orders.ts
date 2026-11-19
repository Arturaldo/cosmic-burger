import type { TIngredient, TOrder, TOrderStatus } from '@utils/types';

export const ORDER_STATUS_LABELS: Record<TOrderStatus, string> = {
  created: 'Создан',
  pending: 'Готовится',
  done: 'Выполнен',
};

export const getIngredientsById = (
  ingredients: TIngredient[]
): Map<string, TIngredient> => new Map(ingredients.map((item) => [item._id, item]));

export const getOrderIngredients = (
  order: TOrder,
  ingredientsById: Map<string, TIngredient>
): TIngredient[] =>
  order.ingredients.flatMap((id): TIngredient[] => {
    const ingredient = ingredientsById.get(id);

    return ingredient ? [ingredient] : [];
  });

export const getOrderPrice = (ingredients: TIngredient[]): number =>
  ingredients.reduce((sum, item): number => sum + item.price, 0);

export const sortByNewest = (orders: TOrder[]): TOrder[] =>
  [...orders].sort((a, b): number => b.createdAt.localeCompare(a.createdAt));

export const splitIntoColumns = (numbers: number[], size: number): number[][] => {
  const columns: number[][] = [];

  for (let i = 0; i < numbers.length; i += size) {
    columns.push(numbers.slice(i, i + size));
  }

  return columns;
};
