export const applyTransform = (slides: (HTMLElement | null)[], translateX: number[]): void => {
  slides.forEach((el, idx) => {
    if (!el) return;
    const x = translateX[idx];
    el.style.transform = `translate3d(${x}px, 0, 0)`;
  });
};
