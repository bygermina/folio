import * as d3 from 'd3';
import type React from 'react';

import { getChartColors } from './types';

export type ChartColors = ReturnType<typeof getChartColors>;

// Типы для масштабов
export type XScale =
  | d3.ScaleTime<number, number>
  | d3.ScaleBand<string>
  | d3.ScaleLinear<number, number>;
export type YScale = d3.ScaleLinear<number, number>;

export interface ChartBaseConfig {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
}

export const DEFAULT_MARGIN = { top: 20, right: 20, bottom: 40, left: 50 };

export const getChartDimensions = (config: ChartBaseConfig) => {
  const margin = config.margin || DEFAULT_MARGIN;
  const chartWidth = config.width - margin.left - margin.right;
  const chartHeight = config.height - margin.top - margin.bottom;

  return { margin, chartWidth, chartHeight };
};

const createHorizontalGrid = (
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  yScale: YScale,
  chartWidth: number,
  chartColors: ChartColors,
) => {
  g.append('g')
    .attr('class', 'grid')
    .call(
      d3
        .axisLeft(yScale)
        .ticks(5)
        .tickSize(-chartWidth)
        .tickFormat(() => ''),
    )
    .attr('stroke', chartColors.grid)
    .attr('stroke-opacity', 0.3)
    .attr('stroke-width', 0.5)
    .attr('stroke-dasharray', '2,2');
};

const createVerticalGrid = (
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  xScale: XScale,
  chartHeight: number,
  chartColors: ChartColors,
) => {
  const gridGroup = g
    .append('g')
    .attr('class', 'grid')
    .attr('transform', `translate(0,${chartHeight})`);

  // Для ScaleBand используем специальную логику
  if ('bandwidth' in xScale) {
    const bandScale = xScale as d3.ScaleBand<string>;
    const domain = bandScale.domain();
    domain.forEach((d) => {
      const x = bandScale(d);
      if (x !== undefined) {
        gridGroup
          .append('line')
          .attr('x1', x)
          .attr('x2', x)
          .attr('y1', 0)
          .attr('y2', -chartHeight)
          .attr('stroke', chartColors.grid)
          .attr('stroke-opacity', 0.3)
          .attr('stroke-width', 0.5)
          .attr('stroke-dasharray', '2,2');
      }
    });
  } else {
    // Для числовых масштабов используем стандартный подход
    gridGroup.call(
      d3
        .axisBottom(xScale as d3.AxisScale<d3.NumberValue>)
        .ticks(5)
        .tickSize(-chartHeight)
        .tickFormat(() => ''),
    );
    gridGroup
      .attr('stroke', chartColors.grid)
      .attr('stroke-opacity', 0.3)
      .attr('stroke-width', 0.5)
      .attr('stroke-dasharray', '2,2');
  }
};

export const createGrid = (
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  xScale: XScale,
  yScale: YScale,
  chartWidth: number,
  chartHeight: number,
  chartColors: ChartColors,
) => {
  createHorizontalGrid(g, yScale, chartWidth, chartColors);
  createVerticalGrid(g, xScale, chartHeight, chartColors);
};

const createXAxis = (
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  xScale: XScale,
  chartHeight: number,
  chartColors: ChartColors,
  ticks?: number,
) => {
  const axisGroup = g.append('g').attr('transform', `translate(0,${chartHeight})`);

  // Для ScaleBand используем axisBottom напрямую
  if ('bandwidth' in xScale) {
    const axis = d3.axisBottom(xScale as d3.ScaleBand<string>);
    axisGroup.call(axis);
  } else {
    // Для числовых масштабов
    const axis = d3.axisBottom(xScale as d3.AxisScale<d3.NumberValue>);
    if (ticks !== undefined) {
      axis.ticks(ticks);
    }
    axisGroup.call(axis);
  }

  axisGroup.attr('color', chartColors.text).attr('font-size', '12px');
};

const createYAxis = (
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  yScale: YScale,
  chartColors: ChartColors,
  ticks?: number,
) => {
  const axis = d3.axisLeft(yScale);
  if (ticks !== undefined) {
    axis.ticks(ticks);
  }
  g.append('g').call(axis).attr('color', chartColors.text).attr('font-size', '12px');
};

export const createAxes = (
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  xScale: XScale,
  yScale: YScale,
  chartHeight: number,
  chartColors: ChartColors,
  xTicks?: number,
  yTicks?: number,
) => {
  createXAxis(g, xScale, chartHeight, chartColors, xTicks);
  createYAxis(g, yScale, chartColors, yTicks);
};

export const initChart = (
  svgRef: React.RefObject<SVGSVGElement | null>,
  margin: { top: number; right: number; bottom: number; left: number },
): d3.Selection<SVGGElement, unknown, null, undefined> | null => {
  if (!svgRef.current) return null;

  const svg = d3.select(svgRef.current);
  svg.selectAll('*').remove();

  return svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
};

export const createXAxisLabel = (
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  label: string,
  chartWidth: number,
  chartHeight: number,
  chartColors: ChartColors,
  offset = 35,
) => {
  g.append('text')
    .attr('transform', `translate(${chartWidth / 2}, ${chartHeight + offset})`)
    .style('text-anchor', 'middle')
    .attr('fill', chartColors.textSecondary)
    .attr('font-size', '11px')
    .text(label);
};

export const createYAxisLabel = (
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  label: string,
  chartHeight: number,
  chartColors: ChartColors,
  offset = 40,
) => {
  g.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', -offset)
    .attr('x', -chartHeight / 2)
    .style('text-anchor', 'middle')
    .attr('fill', chartColors.textSecondary)
    .attr('font-size', '11px')
    .text(label);
};

export interface LegendItem {
  label: string;
  color: string;
  type?: 'line' | 'circle' | 'rect';
}

export const createLineLegend = (
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  items: LegendItem[],
  chartWidth: number,
  chartColors: ChartColors,
  position = { x: 120, y: 10 },
  itemHeight = 20,
) => {
  const legend = g
    .append('g')
    .attr('transform', `translate(${chartWidth - position.x}, ${position.y})`);

  items.forEach((item, i) => {
    const legendRow = legend.append('g').attr('transform', `translate(0, ${i * itemHeight})`);

    legendRow
      .append('line')
      .attr('x1', 0)
      .attr('x2', 15)
      .attr('y1', 0)
      .attr('y2', 0)
      .attr('stroke', item.color)
      .attr('stroke-width', 2);

    legendRow
      .append('text')
      .attr('x', 20)
      .attr('y', 4)
      .attr('fill', chartColors.text)
      .attr('font-size', '11px')
      .text(item.label);
  });
};

export const createCircleLegend = (
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  items: LegendItem[],
  chartWidth: number,
  chartColors: ChartColors,
  position = { x: 100, y: 10 },
  itemHeight = 20,
  radius = 5,
) => {
  const legend = g
    .append('g')
    .attr('transform', `translate(${chartWidth - position.x}, ${position.y})`);

  items.forEach((item, i) => {
    const legendRow = legend.append('g').attr('transform', `translate(0, ${i * itemHeight})`);

    legendRow.append('circle').attr('r', radius).attr('fill', item.color).attr('opacity', 0.7);

    legendRow
      .append('text')
      .attr('x', radius * 2 + 2)
      .attr('y', 4)
      .attr('fill', chartColors.text)
      .attr('font-size', '11px')
      .text(item.label);
  });
};

export const createRectLegend = (
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  items: LegendItem[],
  width: number,
  chartColors: ChartColors,
  position = { x: 150, y: 20 },
  itemHeight = 25,
  rectSize = { width: 15, height: 15 },
) => {
  const legend = svg
    .append('g')
    .attr('transform', `translate(${width - position.x}, ${position.y})`);

  items.forEach((item, i) => {
    const legendRow = legend.append('g').attr('transform', `translate(0, ${i * itemHeight})`);

    legendRow
      .append('rect')
      .attr('width', rectSize.width)
      .attr('height', rectSize.height)
      .attr('fill', item.color)
      .attr('rx', 2);

    legendRow
      .append('text')
      .attr('x', rectSize.width + 5)
      .attr('y', rectSize.height - 3)
      .attr('fill', chartColors.text)
      .attr('font-size', '11px')
      .text(item.label);
  });
};
