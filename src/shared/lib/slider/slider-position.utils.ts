export interface Dimensions {
  left: number;
  right: number;
  width: number;
}

export const getElementDimensions = (element?: HTMLElement | null): Dimensions => {
  const elementDimensions = element?.getBoundingClientRect();

  return {
    left: elementDimensions?.left || 0,
    right: elementDimensions?.right || 0,
    width: elementDimensions?.width || 0,
  };
};

export const getInitialSlides = <T>(arr: T[], containerWidth: number, slideWidth: number) => {
  if (containerWidth === 0 || arr.length === 0) return arr;

  const expectedWidth = containerWidth + slideWidth * 2;
  const copyArray = structuredClone(arr);
  const chain = [...copyArray];

  while (chain.length * slideWidth < expectedWidth) {
    chain.push(...copyArray);
  }

  return chain;
};

export const getStartState = (slidesNumber: number): number[] =>
  Array.from({ length: slidesNumber }, () => 0);

export const updateInfiniteScrollPositions =
  (slides: (HTMLElement | null)[], container: Dimensions, slidesNumber: number, gap: number) =>
  (prevTranslateX: number[], delta: number): number[] =>
    prevTranslateX.map((prevValue, index) => {
      const el = slides[index];
      if (!el) return prevValue;

      const element = getElementDimensions(el);
      let newValue = prevValue + delta;

      if (delta < 0 && element.right < container.left) {
        newValue += slidesNumber * (element.width + gap);
      } else if (delta > 0 && element.left > container.right) {
        newValue -= slidesNumber * (element.width + gap);
      }

      return newValue;
    });
