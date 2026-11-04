import { Link } from 'react-router-dom';

import styles from './not-found.module.css';

export const NotFoundPage = (): React.JSX.Element => (
  <section className={styles.not_found}>
    <h1 className="text text_type_main-large mb-5">Такой страницы не существует</h1>
    <p className="text text_type_main-default text_color_inactive">
      Проверьте адрес или{' '}
      <Link to="/" className="link">
        перейдите на главную
      </Link>
    </p>
  </section>
);
