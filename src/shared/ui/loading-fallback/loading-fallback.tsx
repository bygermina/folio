import styles from './loading-fallback.module.scss';

export const LoadingFallback = () => {
  return (
    <div className={styles.loading}>
      <div className={styles.spinner} />
      <span className={styles.loadingText}>Loading...</span>
    </div>
  );
};

