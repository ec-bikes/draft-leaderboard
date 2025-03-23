import {
  Chart,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  TimeScale,
  Title,
  Tooltip,
  type ChartData,
  type ChartDataset,
  type ChartOptions,
  type Point,
} from 'chart.js';
import React from 'react';

import './dateAdapter.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { fontFamily } from '../theme.js';

/** Series of data */
export type LineChartDataset = ChartDataset<'line', Point[]>;

export type LineChartProps = React.CanvasHTMLAttributes<HTMLCanvasElement> & {
  data: ChartData<'line', Point[], string>;
  options: ChartOptions<'line'>;
  fallbackContent?: React.ReactNode;
};

/**
 * chart.js line chart wrapper, somewhat based on react-chartjs-2.
 *
 * NOTE: logic for handling prop updates was removed since it's not needed.
 */
export function LineChart(props: LineChartProps) {
  const { data, options, fallbackContent, ...rest } = props;
  const chartRef = React.useRef<Chart<'line', Point[], string>>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    Chart.register(
      LineController,
      LineElement,
      LinearScale,
      PointElement,
      TimeScale,
      Legend,
      Tooltip,
      Title,
      zoomPlugin,
    );

    // For some reason setting this at the top level of the options doesn't work,
    // so set it globally
    Chart.defaults.font.family = fontFamily;

    chartRef.current = new Chart(canvasRef.current!, { type: 'line', data, options });

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only run once
  }, []);

  return (
    <canvas role="img" {...rest} ref={canvasRef}>
      {fallbackContent}
    </canvas>
  );
}
