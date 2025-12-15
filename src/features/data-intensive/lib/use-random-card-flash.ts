import { useEffect } from 'react';

interface UseRandomCardFlashParams {
  container: HTMLDivElement | null;
  isEnabled: boolean;
  flashCount?: number;
  flashDurationMs?: number;
  intervalMs?: number;
}

export const useRandomCardFlash = ({
  container,
  isEnabled,
  flashCount = 6,
  flashDurationMs = 500,
  intervalMs = 200,
}: UseRandomCardFlashParams) => {
  useEffect(() => {
    if (!isEnabled || !container) return;
    if (flashCount <= 0 || intervalMs <= 0 || flashDurationMs <= 0) return;

    const flashOnce = () => {
      if (typeof document !== 'undefined' && document.hidden) return;

      const cards = container.querySelectorAll<HTMLDivElement>('[data-role="data-card"]');
      const totalCards = cards.length;

      if (!totalCards) return;

      const effectiveFlashCount = Math.min(flashCount, totalCards);
      const getRandomIndex = () => Math.floor(Math.random() * totalCards);

      for (let index = 0; index < effectiveFlashCount; index++) {
        const randomIndex = getRandomIndex();
        const card = cards[randomIndex];
        if (!card) continue;

        if (card.dataset.flash === 'true') continue;

        card.dataset.flash = 'true';

        setTimeout(() => {
          if (card.dataset.flash === 'true') card.dataset.flash = 'false';
        }, flashDurationMs);
      }
    };

    const intervalId = setInterval(flashOnce, intervalMs);

    return () => clearInterval(intervalId);
  }, [container, flashCount, flashDurationMs, intervalMs, isEnabled]);
};
