import {
  Button,
  EmailInput,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useState } from 'react';

import { getApiErrorMessage, useUpdateUserMutation } from '@services/api';
import { useAppSelector } from '@services/hooks';
import { selectUser } from '@services/user/selectors';

import type { TUpdateUserData } from '@utils/types';
import type { FormEvent } from 'react';

import styles from './profile-form.module.css';

export const ProfileForm = (): React.JSX.Element => {
  const user = useAppSelector(selectUser);
  const [updateUser, { error, isLoading }] = useUpdateUserMutation();

  const [nameValue, setNameValue] = useState(user?.name ?? '');
  const [emailValue, setEmailValue] = useState(user?.email ?? '');
  const [passwordValue, setPasswordValue] = useState('');

  const initialName = user?.name ?? '';
  const initialEmail = user?.email ?? '';

  const isFormChanged =
    nameValue !== initialName || emailValue !== initialEmail || passwordValue !== '';

  const handleCancel = useCallback((): void => {
    setNameValue(initialName);
    setEmailValue(initialEmail);
    setPasswordValue('');
  }, [initialEmail, initialName]);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>): void => {
      event.preventDefault();

      if (!isFormChanged) {
        return;
      }

      // На сервер уходит только то, что действительно изменилось.
      const changedData: TUpdateUserData = {};

      if (nameValue !== initialName) {
        changedData.name = nameValue;
      }

      if (emailValue !== initialEmail) {
        changedData.email = emailValue;
      }

      if (passwordValue !== '') {
        changedData.password = passwordValue;
      }

      updateUser(changedData)
        .unwrap()
        .then((): void => {
          setPasswordValue('');
        })
        .catch((): void => {
          // Ошибка показывается через состояние хука мутации.
        });
    },
    [
      emailValue,
      initialEmail,
      initialName,
      isFormChanged,
      nameValue,
      passwordValue,
      updateUser,
    ]
  );

  return (
    <form className={styles.profile_form} onSubmit={handleSubmit} name="profile">
      <Input
        type="text"
        name="name"
        placeholder="Имя"
        icon="EditIcon"
        value={nameValue}
        onChange={(event): void => {
          setNameValue(event.target.value);
        }}
      />
      <EmailInput
        name="email"
        placeholder="E-mail"
        isIcon
        value={emailValue}
        onChange={(event): void => {
          setEmailValue(event.target.value);
        }}
      />
      <PasswordInput
        name="password"
        placeholder="Введите новый пароль"
        icon="EditIcon"
        value={passwordValue}
        onChange={(event): void => {
          setPasswordValue(event.target.value);
        }}
      />
      {error && (
        <p className={`${styles.error} text text_type_main-default`}>
          {getApiErrorMessage(error)}
        </p>
      )}
      {isFormChanged && (
        <div className={styles.actions}>
          <Button
            type="secondary"
            size="medium"
            htmlType="button"
            disabled={isLoading}
            onClick={handleCancel}
          >
            Отмена
          </Button>
          <Button type="primary" size="medium" htmlType="submit" disabled={isLoading}>
            {isLoading ? 'Сохраняем...' : 'Сохранить'}
          </Button>
        </div>
      )}
    </form>
  );
};
