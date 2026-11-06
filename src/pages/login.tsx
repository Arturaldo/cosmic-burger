import { EmailInput, PasswordInput } from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { AuthLayout } from '@components/auth-layout/auth-layout';
import { getApiErrorMessage, useLoginUserMutation } from '@services/api';

import type { TLocationState } from '@utils/types';
import type { FormEvent } from 'react';

export const LoginPage = (): React.JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loginUser, { error, isLoading }] = useLoginUserMutation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Маршрут, на который пользователь не смог попасть до авторизации.
  const from = (location.state as TLocationState | null)?.from;

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>): void => {
      event.preventDefault();
      loginUser({ email, password })
        .unwrap()
        .then((): void => {
          void navigate(from ?? '/', { replace: true });
        })
        .catch((): void => {
          // Ошибка показывается через состояние хука мутации.
        });
    },
    [email, from, loginUser, navigate, password]
  );

  return (
    <AuthLayout
      title="Вход"
      submitLabel={isLoading ? 'Входим...' : 'Войти'}
      isSubmitDisabled={isLoading}
      errorText={getApiErrorMessage(error)}
      onSubmit={handleSubmit}
      footer={
        <>
          <p className="text text_type_main-default text_color_inactive">
            Вы — новый пользователь?{' '}
            <Link to="/register" className="link">
              Зарегистрироваться
            </Link>
          </p>
          <p className="text text_type_main-default text_color_inactive">
            Забыли пароль?{' '}
            <Link to="/forgot-password" className="link">
              Восстановить пароль
            </Link>
          </p>
        </>
      }
    >
      <EmailInput
        name="email"
        placeholder="E-mail"
        value={email}
        onChange={(event): void => {
          setEmail(event.target.value);
        }}
      />
      <PasswordInput
        name="password"
        placeholder="Пароль"
        value={password}
        onChange={(event): void => {
          setPassword(event.target.value);
        }}
      />
    </AuthLayout>
  );
};
