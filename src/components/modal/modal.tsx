import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import { ModalOverlay } from '@components/modal-overlay/modal-overlay';

import type { ReactNode } from 'react';

import styles from './modal.module.css';

type TModalProps = {
  title?: string;
  onClose: () => void;
  children: ReactNode;
};

export const Modal = ({ title, onClose, children }: TModalProps): React.JSX.Element => {
  useEffect((): void | (() => void) => {
    const handleEscClose = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscClose);

    return () => {
      document.removeEventListener('keydown', handleEscClose);
    };
  }, [onClose]);

  return createPortal(
    <>
      <ModalOverlay onClick={onClose} />
      <div className={styles.modal} role="dialog" aria-modal="true">
        <header className={styles.modal_header}>
          {title && (
            <h2 className={`${styles.modal_title} text text_type_main-large`}>
              {title}
            </h2>
          )}
          <CloseIcon type="primary" onClick={onClose} />
        </header>
        {children}
      </div>
    </>,
    document.getElementById('react-modals')!
  );
};
