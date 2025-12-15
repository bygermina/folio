# Design System

Centralized design system for the Portfolio project.

## Structure

```
design-system/
├── _tokens.scss      # Design tokens (colors, spacing, typography)
├── _functions.scss   # SCSS functions for working with tokens
├── _mixins.scss      # Reusable mixins
├── _css-variables.scss # CSS variables for runtime
└── _index.scss       # Entry point
```

## Usage

### In SCSS files

```scss
@use '../styles/design-system' as *;

.my-component {
  // Using functions
  color: ds-color('cyan', 400);
  padding: spacing(4);
  border-radius: radius(md);
  font-size: font-size(base);

  // Using mixins
  @include typography(base, medium);
  @include focus-ring('cyan', 400);
  @include flex-center;

  // Responsive
  @include respond-to(md) {
    padding: spacing(8);
  }
}
```

### In React components

Use CSS variables for runtime values:

```tsx
<div style={{ color: 'var(--color-cyan-400)', padding: 'var(--spacing-4)' }}>Content</div>
```

## Tokens

### Colors

```scss
ds-color('cyan', 400)      // Primary cyan
ds-color('slate', 800)     // Dark slate
color-opacity('cyan', 400, 0.5) // With opacity
```

### Spacing

```scss
spacing(1)  // 4px
spacing(4)  // 16px
spacing(8)  // 32px
```

### Typography

```scss
@include typography(base, medium); // Size and weight
font-size: font-size(xl);
line-height: line-height(xl);
font-weight: font-weight(bold);
```

### Shadows

```scss
box-shadow: shadow(lg);
```

### Z-index

```scss
z-index: z(modal);
```

## Mixins

### `@include button-base`

Base styles for buttons

### `@include typography($size, $weight)`

Typography with size and weight

### `@include focus-ring($color, $shade, $opacity)`

Styles for focus state

### `@include respond-to($breakpoint)`

Responsive breakpoints

### `@include flex-center`

Flexbox with centering

### `@include truncate`

Text truncation with ellipsis

### `@include scrollbar($width, $track-color, $thumb-color)`

Custom scrollbar

## Extending

To add new tokens:

1. Add to `_tokens.scss`
2. Create a function in `_functions.scss` (if needed)
3. Update `_css-variables.scss` for runtime usage
