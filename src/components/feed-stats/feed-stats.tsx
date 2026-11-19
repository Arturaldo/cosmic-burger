import { splitIntoColumns } from '@utils/orders';

import type { TOrder } from '@utils/types';

import styles from './feed-stats.module.css';

const COLUMN_SIZE = 10;

type TFeedStatsProps = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

type TNumbersBoardProps = {
  title: string;
  numbers: number[];
  isDone?: boolean;
};

const NumbersBoard = ({
  title,
  numbers,
  isDone = false,
}: TNumbersBoardProps): React.JSX.Element => (
  <div className={styles.board}>
    <h3 className="text text_type_main-medium mb-6">{title}</h3>
    <div className={styles.columns}>
      {splitIntoColumns(numbers, COLUMN_SIZE).map((column) => (
        <ul key={column[0]} className={styles.column}>
          {column.map((number) => (
            <li
              key={number}
              className={`text text_type_digits-default ${isDone ? styles.done : ''}`}
            >
              {number}
            </li>
          ))}
        </ul>
      ))}
    </div>
  </div>
);

export const FeedStats = ({
  orders,
  total,
  totalToday,
}: TFeedStatsProps): React.JSX.Element => {
  const doneNumbers = orders
    .filter((order) => order.status === 'done')
    .map((order) => order.number);
  const pendingNumbers = orders
    .filter((order) => order.status === 'pending')
    .map((order) => order.number);

  return (
    <section className={styles.stats}>
      <div className={styles.boards}>
        <NumbersBoard title="Готовы:" numbers={doneNumbers} isDone />
        <NumbersBoard title="В работе:" numbers={pendingNumbers} />
      </div>
      <h3 className="text text_type_main-medium mt-15">Выполнено за все время:</h3>
      <p className="text text_type_digits-large">{total}</p>
      <h3 className="text text_type_main-medium mt-15">Выполнено за сегодня:</h3>
      <p className="text text_type_digits-large">{totalToday}</p>
    </section>
  );
};
