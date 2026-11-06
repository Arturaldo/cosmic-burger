import {
  EmailInput,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { AuthLayout } from '@components/auth-layout/auth-layout';
import { getApiErrorMessage, useRegisterUserMutation } from '@services/api';

import type { FormEvent } from 'react';

export const RegisterPage = (): React.JSX.Element => {
  const navigate = useNavigate();
  const [registerUser, { error, isLoading }] = useRegisterUserMutation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>): void => {
      event.preventDefault();
      registerUser({ name, email, password })
        .unwrap()
        .then((): void => {
          // После успешной регистрации пользователь сразу авторизован.
          void navigate('/', { replace: true });
        })
        .catch((): void => {
          // Ошибка показывается через состояние хука мутации.
        });
    },
    [email, name, navigate, password, registerUser]
  );

  return (
    <AuthLayout
      title="Регистрация"
      submitLabel={isLoading ? 'Регистрируем...' : 'Зарегистрироваться'}
      isSubmitDisabled={isLoading}
      errorText={getApiErrorMessage(error)}
      onSubmit={handleSubmit}
      footer={
        <p className="text text_type_main-default text_color_inactive">
          Уже зарегистрированы?{' '}
          <Link to="/login" className="link">
            Войти
          </Link>
        </p>
      }
    >
      <Input
        type="text"
        name="name"
        placeholder="Имя"
        value={name}
        onChange={(event): void => {
          setName(event.target.value);
        }}
      />
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
