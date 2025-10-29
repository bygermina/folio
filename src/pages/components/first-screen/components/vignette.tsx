import tailwindConfig from '../../../../../tailwind.config';

const colors = tailwindConfig.theme.extend.colors.dark;

export const Vignette = () => {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        background: `linear-gradient(to bottom, ${colors.medium} 0%, ${colors.light} 25%, ${colors.light} 75%, ${colors.medium} 100%)`,
      }}
    />
  );
};
