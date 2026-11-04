import { Route, Routes, useLocation } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header';
import { IngredientDetailsModal } from '@components/ingredient-details-modal/ingredient-details-modal';
import { ProtectedRoute } from '@components/protected-route/protected-route';
import { ForgotPasswordPage } from '@pages/forgot-password';
import { HomePage } from '@pages/home';
import { IngredientPage } from '@pages/ingredient';
import { LoginPage } from '@pages/login';
import { NotFoundPage } from '@pages/not-found';
import { ProfilePage } from '@pages/profile';
import { ProfileOrdersPage } from '@pages/profile-orders';
import { ProfileSettingsPage } from '@pages/profile-settings';
import { RegisterPage } from '@pages/register';
import { ResetPasswordPage } from '@pages/reset-password';
import { useGetUserQuery } from '@services/api';
import { REFRESH_TOKEN_COOKIE } from '@utils/constants';
import { getCookie } from '@utils/cookies';

import type { TLocationState } from '@utils/types';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  // Первичная проверка авторизации: если есть refreshToken, узнаём, кто вошёл.
  useGetUserQuery(undefined, { skip: !getCookie(REFRESH_TOKEN_COOKIE) });

  const location = useLocation();
  // Страница, поверх которой открыто модальное окно ингредиента.
  const background = (location.state as TLocationState | null)?.background;

  return (
    <div className={styles.app}>
      <AppHeader />
      <main className={`${styles.main} pl-5 pr-5`}>
        <Routes location={background ?? location}>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/login"
            element={
              <ProtectedRoute onlyUnAuth>
                <LoginPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/register"
            element={
              <ProtectedRoute onlyUnAuth>
                <RegisterPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <ProtectedRoute onlyUnAuth>
                <ForgotPasswordPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reset-password"
            element={
              <ProtectedRoute onlyUnAuth>
                <ResetPasswordPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          >
            <Route index element={<ProfileSettingsPage />} />
            <Route path="orders" element={<ProfileOrdersPage />} />
          </Route>
          <Route path="/ingredients/:id" element={<IngredientPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {/* Модальное окно ингредиента поверх страницы, с которой оно открыто. */}
      {background && (
        <Routes>
          <Route path="/ingredients/:id" element={<IngredientDetailsModal />} />
        </Routes>
      )}
    </div>
  );
};

export default App;
