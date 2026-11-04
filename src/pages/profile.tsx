import { Outlet } from 'react-router-dom';

import { ProfileMenu } from '@components/profile-menu/profile-menu';

import styles from './profile.module.css';

export const ProfilePage = (): React.JSX.Element => (
  <section className={styles.profile}>
    <ProfileMenu />
    <div className={styles.content}>
      <Outlet />
    </div>
  </section>
);
