import { EmailInput } from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { AuthLayout } from '@components/auth-layout/auth-layout';
import { getApiErrorMessage, useForgotPasswordMutation } from '@services/api';
import { useAppDispatch } from '@services/hooks';
import { forgotPasswordVisited } from '@services/user/slice';

import type { FormEvent } from 'react';

export const ForgotPasswordPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [forgotPassword, { error, isLoading }] = useForgotPasswordMutation();

  const [email, setEmail] = useState('');

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>): void => {
      event.preventDefault();
      forgotPassword({ email })
        .unwrap()
        .then((): void => {
          // Письмо отправлено — разрешаем доступ к странице сброса пароля.
          dispatch(forgotPasswordVisited());
          void navigate('/reset-password', { replace: true });
        })
        .catch((): void => {
          // Ошибка показывается через состояние хука мутации.
        });
    },
    [dispatch, email, forgotPassword, navigate]
  );

  return (
    <AuthLayout
      title="Восстановление пароля"
      submitLabel={isLoading ? 'Отправляем...' : 'Восстановить'}
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
      <EmailInput
        name="email"
        placeholder="Укажите e-mail"
        value={email}
        onChange={(event): void => {
          setEmail(event.target.value);
        }}
      />
    </AuthLayout>
  );
};
