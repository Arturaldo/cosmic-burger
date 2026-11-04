import { Button } from '@krgaa/react-developer-burger-ui-components';

import type { FormEvent, ReactNode } from 'react';

import styles from './auth-layout.module.css';

type TAuthLayoutProps = {
  title: string;
  submitLabel: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isSubmitDisabled?: boolean;
  errorText?: string | null;
  footer?: ReactNode;
  /** Поля формы. */
  children: ReactNode;
};

/** Общая разметка страниц авторизации: заголовок, форма и подсказки под ней. */
export const AuthLayout = ({
  title,
  submitLabel,
  onSubmit,
  isSubmitDisabled = false,
  errorText,
  footer,
  children,
}: TAuthLayoutProps): React.JSX.Element => (
  <section className={styles.auth}>
    <h1 className={`${styles.title} text text_type_main-medium`}>{title}</h1>
    <form className={styles.form} onSubmit={onSubmit}>
      {children}
      {errorText && (
        <p className={`${styles.error} text text_type_main-default`}>{errorText}</p>
      )}
      <Button type="primary" size="medium" htmlType="submit" disabled={isSubmitDisabled}>
        {submitLabel}
      </Button>
    </form>
    {footer && <div className={styles.footer}>{footer}</div>}
  </section>
);
