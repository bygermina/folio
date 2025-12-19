import styles from './index.module.scss';

const ChartsPage = () => {
  return (
    <div className={styles.content}>
      <div className={styles.placeholder}>
        <h1 className={styles.title}>Charts</h1>
        <p className={styles.description}>
          Charts custom and build with different libraries.
        </p>
        <p className={styles.comingSoon}>Coming soon...</p>
      </div>
    </div>
  );
};

export default ChartsPage;
