import { MainWidget } from '@/widgets/main';
import { FooterWidget } from '@/widgets/footer';

import styles from './index.module.scss';

const HomePage = () => {
  return (
    <div className={styles.content}>
      <MainWidget animate={true} />
      <FooterWidget />
    </div>
  );
};

export default HomePage;
