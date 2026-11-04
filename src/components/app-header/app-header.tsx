import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { NavLink } from 'react-router-dom';

import styles from './app-header.module.css';

const linkClassName = ({ isActive }: { isActive: boolean }): string =>
  isActive ? `${styles.link} ${styles.link_active}` : styles.link;

const feedLinkClassName = (props: { isActive: boolean }): string =>
  `${linkClassName(props)} ml-10`;

const profileLinkClassName = (props: { isActive: boolean }): string =>
  `${linkClassName(props)} ${styles.link_position_last}`;

const iconType = (isActive: boolean): 'primary' | 'secondary' =>
  isActive ? 'primary' : 'secondary';

export const AppHeader = (): React.JSX.Element => {
  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <NavLink to="/" end className={linkClassName}>
            {({ isActive }): React.JSX.Element => (
              <>
                <BurgerIcon type={iconType(isActive)} />
                <p className="text text_type_main-default ml-2">Конструктор</p>
              </>
            )}
          </NavLink>
          <NavLink to="/feed" className={feedLinkClassName}>
            {({ isActive }): React.JSX.Element => (
              <>
                <ListIcon type={iconType(isActive)} />
                <p className="text text_type_main-default ml-2">Лента заказов</p>
              </>
            )}
          </NavLink>
        </div>
        <div className={styles.logo}>
          <Logo />
        </div>
        <NavLink to="/profile" className={profileLinkClassName}>
          {({ isActive }): React.JSX.Element => (
            <>
              <ProfileIcon type={iconType(isActive)} />
              <p className="text text_type_main-default ml-2">Личный кабинет</p>
            </>
          )}
        </NavLink>
      </nav>
    </header>
  );
};
