import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { Navigate, useLocation } from 'react-router-dom';

import { useAppSelector } from '@services/hooks';
import { selectIsAuthChecked, selectUser } from '@services/user/selectors';

import type { TLocationState } from '@utils/types';
import type { ReactElement } from 'react';

import styles from './protected-route.module.css';

type TProtectedRouteProps = {
  /** Если true — маршрут, наоборот, доступен только неавторизованным. */
  onlyUnAuth?: boolean;
  children: ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children,
}: TProtectedRouteProps): React.JSX.Element => {
  const user = useAppSelector(selectUser);
  const isAuthChecked = useAppSelector(selectIsAuthChecked);
  const location = useLocation();

  // Маршрут, с которого неавторизованный пользователь попал на /login.
  const from = (location.state as TLocationState | null)?.from;

  // Пока идёт первичная проверка авторизации, ничего не решаем.
  if (!isAuthChecked) {
    return (
      <div className={styles.status}>
        <Preloader />
      </div>
    );
  }

  if (onlyUnAuth) {
    // Авторизованного не пускаем на страницы входа и регистрации:
    // возвращаем на маршрут, с которого он пришёл на /login.
    return user ? <Navigate to={from ?? '/'} replace /> : children;
  }

  // Неавторизованного отправляем на вход и запоминаем, откуда он пришёл.
  return user ? children : <Navigate to="/login" replace state={{ from: location }} />;
};
