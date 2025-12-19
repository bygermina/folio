import { MainWidget } from '@/widgets/main';
import { FooterWidget } from '@/widgets/footer';
import { useNavigationContext } from '@/widgets/navigation';

import styles from './index.module.scss';

const HomePage = () => {
  const { onExploreClick } = useNavigationContext();

  return (
    <div className={styles.content}>
      <MainWidget animate={true} onExploreClick={onExploreClick} />
      <FooterWidget />
    </div>
  );
};

export default HomePage;
