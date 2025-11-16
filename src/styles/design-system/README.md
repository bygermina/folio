# Design System

Централизованная система дизайна для проекта Portfolio.

## Структура

```
design-system/
├── _tokens.scss      # Дизайн-токены (цвета, отступы, типографика)
├── _functions.scss   # SCSS функции для работы с токенами
├── _mixins.scss      # Переиспользуемые миксины
├── _css-variables.scss # CSS переменные для runtime
└── _index.scss       # Точка входа
```

## Использование

### В SCSS файлах

```scss
@use '../styles/design-system' as *;

.my-component {
  // Использование функций
  color: ds-color('cyan', 400);
  padding: spacing(4);
  border-radius: radius(md);
  font-size: font-size(base);
  
  // Использование миксинов
  @include typography(base, medium);
  @include focus-ring('cyan', 400);
  @include flex-center;
  
  // Responsive
  @include respond-to(md) {
    padding: spacing(8);
  }
}
```

### В компонентах React

Используйте CSS переменные для runtime значений:

```tsx
<div style={{ color: 'var(--color-cyan-400)', padding: 'var(--spacing-4)' }}>
  Content
</div>
```

## Токены

### Цвета

```scss
ds-color('cyan', 400)      // Основной cyan
ds-color('slate', 800)     // Темный slate
color-opacity('cyan', 400, 0.5) // С прозрачностью
```

### Отступы

```scss
spacing(1)  // 4px
spacing(4)  // 16px
spacing(8)  // 32px
```

### Типографика

```scss
@include typography(base, medium);  // Размер и вес
font-size: font-size(xl);
line-height: line-height(xl);
font-weight: font-weight(bold);
```

### Тени

```scss
box-shadow: shadow(lg);
```

### Z-index

```scss
z-index: z(modal);
```

## Миксины

### `@include button-base`
Базовые стили для кнопок

### `@include typography($size, $weight)`
Типографика с размером и весом

### `@include focus-ring($color, $shade, $opacity)`
Стили для focus состояния

### `@include respond-to($breakpoint)`
Responsive breakpoints

### `@include flex-center`
Flexbox с центрированием

### `@include truncate`
Обрезка текста с ellipsis

### `@include scrollbar($width, $track-color, $thumb-color)`
Кастомный скроллбар

## Расширение

Для добавления новых токенов:

1. Добавьте в `_tokens.scss`
2. Создайте функцию в `_functions.scss` (если нужно)
3. Обновите `_css-variables.scss` для runtime использования

