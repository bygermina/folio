import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { useIntersectionObserver } from '@/shared/lib/hooks/use-intersection-observer';
import { normalizeScrollProgress } from '@/shared/lib/animation-helpers';

gsap.registerPlugin(ScrollTrigger);

import {
  createIcosahedronVertices,
  ICOSAHEDRON_EDGES,
  calculateIcosahedronViewBoxSize,
  project3DTo2D,
  rotateVertex3D,
} from '@/shared/lib/geometry-3d';

import styles from './scroll-3d.module.scss';

const getGradientOpacity = (intensity: number) => ({
  start: intensity * 0.6, // Начало градиента (60% от интенсивности)
  middle: intensity * 0.5, // Середина градиента (50% от интенсивности)
  end: intensity * 0.4, // Конец градиента (40% от интенсивности)
});

// Начальные углы вращения для формы сердца
// Эти углы поворачивают икосаэдр так, чтобы он выглядел как сердце
const INITIAL_ROTATION_ANGLES = { rotateX: -10, rotateY: 45, rotateZ: 0 };

// Начальная прозрачность градиента (константа)
const INITIAL_GRADIENT_OPACITY = getGradientOpacity(0.7);

/**
 * Обновляет позиции линий икосаэдра в SVG
 * Прямо изменяет атрибуты DOM элементов для избежания лишних рендеров
 *
 * @param lines - Массив ссылок на SVG элементы линий
 * @param vertices - Массив вершин икосаэдра в 3D пространстве
 * @param rotationAngles - Углы вращения вокруг осей X, Y, Z
 * @param centerOffset - Смещение для центрирования в viewBox
 */
const updateLinePositions = (
  lines: (SVGLineElement | null)[],
  vertices: Array<[number, number, number]>,
  rotationAngles: { rotateX: number; rotateY: number; rotateZ: number },
  centerOffset: number,
): void => {
  ICOSAHEDRON_EDGES.forEach((edge, index) => {
    const line = lines[index];
    if (!line) return;

    // Получаем индексы вершин, соединенных этим ребром
    const [v1Index, v2Index] = edge;

    // Получаем координаты вершин в 3D пространстве
    const v1 = vertices[v1Index];
    const v2 = vertices[v2Index];

    // Применяем 3D повороты к вершинам на основе текущих углов вращения
    const rotatedV1 = rotateVertex3D(v1, rotationAngles);
    const rotatedV2 = rotateVertex3D(v2, rotationAngles);

    // Проецируем повернутые 3D вершины в 2D координаты для SVG
    const p1 = project3DTo2D(rotatedV1, centerOffset);
    const p2 = project3DTo2D(rotatedV2, centerOffset);

    // Прямо обновляем атрибуты линии через DOM API (без React рендера)
    line.setAttribute('x1', String(p1.x));
    line.setAttribute('y1', String(p1.y));
    line.setAttribute('x2', String(p2.x));
    line.setAttribute('y2', String(p2.y));
  });
};

interface Scroll3DProps {
  scrollStart?: number; // Начальная точка скролла для анимации вращения (0-1)
  scrollEnd?: number; // Конечная точка скролла для анимации вращения (0-1)
  offsetYPercent?: number; // Вертикальное смещение компонента в процентах от верха (0-1)
  size?: number; // Размер икосаэдра (радиус описанной сферы)
  strokeColor?: string; // Цвет обводки линий икосаэдра
}

const Scroll3DComponent = ({
  scrollStart = 0,
  scrollEnd = 1,
  offsetYPercent = 0.5,
  size = 100,
  strokeColor = 'var(--color-blue-400)',
}: Scroll3DProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const linesRefs = useRef<(SVGLineElement | null)[]>([]);
  const rotationAnglesRef = useRef({
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
  });
  const gradientStopsRef = useRef<{
    start: SVGStopElement | null;
    middle: SVGStopElement | null;
    end: SVGStopElement | null;
  }>({
    start: null,
    middle: null,
    end: null,
  });

  const vertices = useMemo(() => createIcosahedronVertices(size), [size]);

  const viewBoxSize = useMemo(() => calculateIcosahedronViewBoxSize(size), [size]);

  // Смещение для центрирования икосаэдра в viewBox
  const centerOffset = viewBoxSize / 2;

  // ID для градиента и фильтра
  const gradientId = 'wireframe-gradient';
  const filterId = 'wireframe-glow';

  const isVisible = useIntersectionObserver(containerRef, { threshold: 0 });

  // Используем GSAP ScrollTrigger для отслеживания скролла
  useEffect(() => {
    if (!isVisible) return;

    const updateAnimation = (progress: number) => {
      const normalizedProgress = normalizeScrollProgress(progress, scrollStart, scrollEnd);

      // Начальные углы для формы сердца
      const heartRotation = {
        rotateX: INITIAL_ROTATION_ANGLES.rotateX,
        rotateY: INITIAL_ROTATION_ANGLES.rotateY,
        rotateZ: INITIAL_ROTATION_ANGLES.rotateZ,
      };

      // Обновляем углы вращения: начинаем с сердца, затем добавляем вращение при скролле
      rotationAnglesRef.current = {
        rotateX: heartRotation.rotateX + normalizedProgress * 360,
        rotateY: heartRotation.rotateY + normalizedProgress * -360,
        rotateZ: heartRotation.rotateZ + normalizedProgress * 180,
      };

      // Обновляем позиции линий
      updateLinePositions(linesRefs.current, vertices, rotationAnglesRef.current, centerOffset);

      // Обновляем прозрачность градиента
      const newIntensity = 0.7 + progress * 0.3;
      const gradientOpacity = getGradientOpacity(newIntensity);

      if (gradientStopsRef.current.start) {
        gradientStopsRef.current.start.setAttribute('stop-opacity', String(gradientOpacity.start));
      }
      if (gradientStopsRef.current.middle) {
        gradientStopsRef.current.middle.setAttribute(
          'stop-opacity',
          String(gradientOpacity.middle),
        );
      }
      if (gradientStopsRef.current.end) {
        gradientStopsRef.current.end.setAttribute('stop-opacity', String(gradientOpacity.end));
      }
    };

    // Вычисляем прогресс скролла всей страницы
    const getScrollProgress = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const maxScroll = documentHeight - windowHeight;
      return maxScroll > 0 ? scrollTop / maxScroll : 0;
    };

    // Создаем функцию для обновления через GSAP ticker
    let tickerCallback: (() => void) | null = null;

    const scheduleUpdate = (progress: number) => {
      // Удаляем предыдущий callback, если есть
      if (tickerCallback) {
        gsap.ticker.remove(tickerCallback);
      }

      // Создаем новый callback для обновления
      tickerCallback = () => {
        updateAnimation(progress);
        // Удаляем после одного обновления
        if (tickerCallback) {
          gsap.ticker.remove(tickerCallback);
          tickerCallback = null;
        }
      };

      // Добавляем в GSAP ticker для оптимизированного обновления
      gsap.ticker.add(tickerCallback);
    };

    // Создаем ScrollTrigger для отслеживания скролла всей страницы
    const scrollTrigger = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: () => {
        const progress = getScrollProgress();
        scheduleUpdate(progress);
      },
    });

    // Инициализируем анимацию с текущим прогрессом
    updateAnimation(getScrollProgress());

    // Также слушаем события скролла для более точного обновления
    const handleScroll = () => {
      const progress = getScrollProgress();
      scheduleUpdate(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      scrollTrigger.kill();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      // Очищаем ticker
      if (tickerCallback) {
        gsap.ticker.remove(tickerCallback);
      }
    };
  }, [isVisible, scrollStart, scrollEnd, vertices, centerOffset]);

  // Вычисляем вертикальное смещение в процентах (ограничиваем диапазон 0-100%)
  // offsetYPercent = 0 -> bottom: 0% (правый нижний угол)
  // offsetYPercent = 1 -> bottom: 100% (правый верхний угол)
  const bottomPercent = Math.max(0, Math.min(1, offsetYPercent)) * 100;

  const rootStyle = useMemo(() => ({ bottom: `${bottomPercent}%` }), [bottomPercent]);

  // Функция для установки ссылки на линию
  const setLineRef = useCallback(
    (index: number) => (element: SVGLineElement | null) => {
      linesRefs.current[index] = element;
    },
    [],
  );

  // Функция для установки ссылок на элементы градиента
  const setGradientStopRef = useCallback(
    (type: 'start' | 'middle' | 'end') => (element: SVGStopElement | null) => {
      gradientStopsRef.current[type] = element;
    },
    [],
  );

  return (
    <div ref={containerRef} className={styles.root} style={rootStyle}>
      <div className={styles.container}>
        <div className={styles.scene}>
          <svg
            className={styles.wireframe}
            viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
            preserveAspectRatio="xMidYMid meet" // Сохраняем пропорции, центрируем
            width="600"
            height="600"
          >
            <defs>
              <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop
                  ref={setGradientStopRef('start')}
                  offset="0%"
                  stopColor={strokeColor}
                  stopOpacity={INITIAL_GRADIENT_OPACITY.start}
                />
                <stop
                  ref={setGradientStopRef('middle')}
                  offset="50%"
                  stopColor="var(--color-blue-400)"
                  stopOpacity={INITIAL_GRADIENT_OPACITY.middle}
                />
                <stop
                  ref={setGradientStopRef('end')}
                  offset="100%"
                  stopColor="var(--color-blue-500)"
                  stopOpacity={INITIAL_GRADIENT_OPACITY.end}
                />
              </linearGradient>
            </defs>

            {ICOSAHEDRON_EDGES.map((edge, index) => {
              // Получаем индексы вершин, соединенных этим ребром
              const [v1Index, v2Index] = edge;

              // Получаем координаты вершин в 3D пространстве
              const v1 = vertices[v1Index];
              const v2 = vertices[v2Index];

              // Применяем 3D повороты к вершинам на основе начальных углов вращения
              // Реальные позиции будут обновляться через requestAnimationFrame
              const rotatedV1 = rotateVertex3D(v1, INITIAL_ROTATION_ANGLES);
              const rotatedV2 = rotateVertex3D(v2, INITIAL_ROTATION_ANGLES);

              // Проецируем повернутые 3D вершины в 2D координаты для SVG
              // centerOffset используется для центрирования икосаэдра в viewBox
              const p1 = project3DTo2D(rotatedV1, centerOffset);
              const p2 = project3DTo2D(rotatedV2, centerOffset);

              // Рендерим линию (ребро икосаэдра) между двумя проецированными точками
              // Позиции будут обновляться напрямую через DOM API в requestAnimationFrame
              return (
                <line
                  key={index}
                  ref={setLineRef(index)}
                  x1={p1.x} // X координата первой точки (начальная, будет обновляться)
                  y1={p1.y} // Y координата первой точки (начальная, будет обновляться)
                  x2={p2.x} // X координата второй точки (начальная, будет обновляться)
                  y2={p2.y} // Y координата второй точки (начальная, будет обновляться)
                  stroke={`url(#${gradientId})`}
                  strokeWidth="2"
                  strokeLinecap="round"
                  className={styles.edge} // CSS класс для дополнительных стилей
                  filter={`url(#${filterId})`}
                />
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
};

export const Scroll3D = memo(Scroll3DComponent);
