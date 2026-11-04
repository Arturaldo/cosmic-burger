import { useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import { api, useLogoutUserMutation } from '@services/api';
import { useAppDispatch } from '@services/hooks';
import { userLoggedOut } from '@services/user/actions';
import { clearAuthCookies } from '@utils/cookies';

import styles from './profile-menu.module.css';

const linkClassName = ({ isActive }: { isActive: boolean }): string =>
  isActive ? `${styles.link} ${styles.link_active}` : styles.link;

export const ProfileMenu = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [logoutUser] = useLogoutUserMutation();

  const handleLogout = useCallback((): void => {
    logoutUser()
      .unwrap()
      .catch((): void => {
        // Даже если сервер не отозвал токен, выходим из системы локально.
      })
      .finally((): void => {
        clearAuthCookies();
        dispatch(userLoggedOut());
        dispatch(api.util.resetApiState());
        void navigate('/login', { replace: true });
      });
  }, [dispatch, logoutUser, navigate]);

  return (
    <nav className={styles.profile_menu} aria-label="Меню профиля">
      <NavLink to="/profile" end className={linkClassName}>
        Профиль
      </NavLink>
      <NavLink to="/profile/orders" className={linkClassName}>
        История заказов
      </NavLink>
      <button type="button" className={styles.logout} onClick={handleLogout}>
        Выход
      </button>
      <p className={`${styles.hint} text text_type_main-small text_color_inactive`}>
        В этом разделе вы можете изменить свои персональные данные
      </p>
    </nav>
  );
};
