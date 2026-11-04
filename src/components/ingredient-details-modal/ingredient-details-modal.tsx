import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import { useGetIngredientsQuery } from '@services/api';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { selectViewedIngredient } from '@services/ingredient-details/selectors';
import { clearViewedIngredient } from '@services/ingredient-details/slice';

/**
 * Модальное окно с деталями ингредиента. Отрисовывается маршрутом
 * /ingredients/:id поверх страницы, с которой пользователь открыл ингредиент.
 */
export const IngredientDetailsModal = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const viewedIngredient = useAppSelector(selectViewedIngredient);
  const { data: ingredients = [] } = useGetIngredientsQuery();

  // Обычно ингредиент уже в сторе после клика по карточке. Если страница
  // перезагружена, находим ингредиент по id из маршрута.
  const ingredient =
    viewedIngredient ?? ingredients.find((item): boolean => item._id === id);

  const handleClose = useCallback((): void => {
    dispatch(clearViewedIngredient());
    void navigate(-1);
  }, [dispatch, navigate]);

  if (!ingredient) {
    return <></>;
  }

  return (
    <Modal title="Детали ингредиента" onClose={handleClose}>
      <IngredientDetails ingredient={ingredient} />
    </Modal>
  );
};
