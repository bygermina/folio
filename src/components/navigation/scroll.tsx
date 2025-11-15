import { motion, type HTMLMotionProps } from 'framer-motion';

interface ScrollProps extends HTMLMotionProps<'div'> {
  targetSectionId: string;
  label?: string;
  arrow?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const Scroll = ({
  targetSectionId,
  label,
  arrow,
  className,
  children,
  ...props
}: ScrollProps) => {
  const scrollToNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const targetSection = document.getElementById(targetSectionId);
    if (targetSection) {
      const offset = 0;
      const elementPosition = targetSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`${className} cursor-pointer`}
      {...props}
    >
      <button
        onClick={scrollToNext}
        className="flex flex-col items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors group"
        aria-label={label}
      >
        {children}
        {label && <span className="text-sm font-medium">{label}</span>}
        {arrow && (
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="group-hover:scale-110 transition-transform"
            >
              <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
            </svg>
          </motion.div>
        )}
      </button>
    </motion.div>
  );
};
