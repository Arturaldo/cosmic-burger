import { Input, PasswordInput } from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import { AuthLayout } from '@components/auth-layout/auth-layout';
import { getApiErrorMessage, useResetPasswordMutation } from '@services/api';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { selectIsForgotPasswordVisited } from '@services/user/selectors';
import { resetPasswordCompleted } from '@services/user/slice';

import type { FormEvent } from 'react';

export const ResetPasswordPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isForgotPasswordVisited = useAppSelector(selectIsForgotPasswordVisited);
  const [resetPassword, { error, isLoading }] = useResetPasswordMutation();

  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>): void => {
      event.preventDefault();
      resetPassword({ password, token })
        .unwrap()
        .then((): void => {
          dispatch(resetPasswordCompleted());
          void navigate('/login', { replace: true });
        })
        .catch((): void => {
          // Ошибка показывается через состояние хука мутации.
        });
    },
    [dispatch, navigate, password, resetPassword, token]
  );

  // Сюда можно попасть только после ввода e-mail на странице восстановления.
  if (!isForgotPasswordVisited) {
    return <Navigate to="/forgot-password" replace />;
  }

  return (
    <AuthLayout
      title="Восстановление пароля"
      submitLabel={isLoading ? 'Сохраняем...' : 'Сохранить'}
      isSubmitDisabled={isLoading}
      errorText={getApiErrorMessage(error)}
      onSubmit={handleSubmit}
      footer={
        <p className="text text_type_main-default text_color_inactive">
          Вспомнили пароль?{' '}
          <Link to="/login" className="link">
            Войти
          </Link>
        </p>
      }
    >
      <PasswordInput
        name="password"
        placeholder="Введите новый пароль"
        value={password}
        onChange={(event): void => {
          setPassword(event.target.value);
        }}
      />
      <Input
        type="text"
        name="token"
        placeholder="Введите код из письма"
        value={token}
        onChange={(event): void => {
          setToken(event.target.value);
        }}
      />
    </AuthLayout>
  );
};
