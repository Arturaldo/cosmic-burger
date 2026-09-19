import {
  ConstructorElement,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import { moveIngredient, removeIngredient } from '@services/burger-constructor/slice';
import { useAppDispatch } from '@services/hooks';
import { DND_TYPES } from '@utils/constants';

import type { TConstructorIngredient, TSortItem } from '@utils/types';

import styles from './constructor-ingredient.module.css';

type TConstructorIngredientProps = {
  ingredient: TConstructorIngredient;
  index: number;
};

export const ConstructorIngredient = ({
  ingredient,
  index,
}: TConstructorIngredientProps): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const rowRef = useRef<HTMLLIElement>(null);

  const [{ isDragging }, dragRef] = useDrag<TSortItem, unknown, { isDragging: boolean }>(
    () => ({
      type: DND_TYPES.CONSTRUCTOR_ITEM,
      item: { uid: ingredient.uid, index },
      collect: (monitor): { isDragging: boolean } => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [ingredient.uid, index]
  );

  const [, dropRef] = useDrop<TSortItem>({
    accept: DND_TYPES.CONSTRUCTOR_ITEM,
    hover: (item, monitor): void => {
      const node = rowRef.current;

      if (!node || item.index === index) {
        return;
      }

      const { top, bottom } = node.getBoundingClientRect();
      const middleY = (bottom - top) / 2;
      const offset = monitor.getClientOffset();

      if (!offset) {
        return;
      }

      const hoverY = offset.y - top;

      // Меняем местами только после пересечения середины соседа,
      // иначе элементы «дрожат» на каждом движении мыши.
      if (item.index < index && hoverY < middleY) {
        return;
      }

      if (item.index > index && hoverY > middleY) {
        return;
      }

      dispatch(moveIngredient({ fromIndex: item.index, toIndex: index }));
      item.index = index;
    },
  });

  dragRef(dropRef(rowRef));

  const handleRemove = useCallback((): void => {
    dispatch(removeIngredient(ingredient.uid));
  }, [dispatch, ingredient.uid]);

  return (
    <li
      ref={rowRef}
      className={styles.filling_row}
      style={{ opacity: isDragging ? 0.4 : 1 }}
    >
      <DragIcon type="primary" />
      <ConstructorElement
        text={ingredient.name}
        price={ingredient.price}
        thumbnail={ingredient.image}
        handleClose={handleRemove}
      />
    </li>
  );
};
