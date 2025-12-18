import { Typography } from '@/shared/ui/typography/typography';

import type { LinkData } from '../model/constants';
import type { IconName } from './slide-content';

import styles from './slider-controls.module.scss';

interface SlideInputsProps {
  slides: LinkData[];
  onSlideChange: (index: number, field: 'query' | 'image', value: string) => void;
}

export const SlideInputs = ({ slides, onSlideChange }: SlideInputsProps) => (
  <div className={styles.slidesContainer}>
    {slides.map((slide, index) => (
      <div key={index} className={styles.slide}>
        <Typography variant="caption" className={styles.slideIndex}>
          Slide {index + 1}
        </Typography>
        <input
          type="text"
          value={slide.query}
          onChange={(e) => onSlideChange(index, 'query', e.target.value)}
          placeholder="Slide text"
          className={styles.input}
        />
        <select
          value={slide.image}
          onChange={(e) => onSlideChange(index, 'image', e.target.value as IconName)}
          className={styles.select}
        >
          <option value="reactlogo">React Logo</option>
          <option value="typescript">TypeScript Logo</option>
          <option value="nodejs">Node.js Logo</option>
        </select>
      </div>
    ))}
  </div>
);

