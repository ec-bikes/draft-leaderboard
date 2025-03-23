import React from 'react';
import { useData } from 'vike-react/useData';
import { utcDateFromString } from '../../common/formatDate.js';
import { DraftData } from '../../common/types/DraftData.js';
import type { Group } from '../../common/types/Group.js';
import type { PointsHistory } from '../../common/types/PointsHistory.js';
import { Dialog, type DialogProps } from '../Dialog/Dialog.js';
import type { LineChartDataset, LineChartProps } from './LineChart.js';
import { LineChart } from './LineChart.js';

/**
 * Dialog with a chart showing the history of points for each team.
 */
export default function HistoryDialog(props: Pick<DialogProps, 'onClose'>) {
  const { onClose } = props;
  const { group, year } = useData<DraftData>();
  const [chartProps, setChartProps] = React.useState<LineChartProps>();
  const [error, setError] = React.useState<string>('');

  React.useEffect(() => {
    void getPropsOrError({ group, year }).then((propsOrError) => {
      if (typeof propsOrError === 'string') {
        setError(propsOrError);
      } else {
        setChartProps(propsOrError);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only run once
  }, []);

  return (
    <Dialog title="Rankings history" onClose={onClose} fullWidth maxWidth="md">
      {chartProps ? <LineChart {...chartProps} /> : error}
    </Dialog>
  );
}

async function getPropsOrError(params: {
  group: Group;
  year: number;
}): Promise<Omit<LineChartProps, 'chartRef'> | string> {
  const { group, year } = params;
  let history: PointsHistory;
  try {
    history = await import(`../../data/${group}-${year}/history.json`);
  } catch (err) {
    console.error('Error loading history data:', (err as Error).stack || err);
    return 'Failed to load history data';
  }

  const dates = history.dates.map((date) => utcDateFromString(date).getTime());

  let yMax = 0;
  // Make a series (dataset) for each team
  const datasets: LineChartDataset[] = Object.entries(history.teams).map(([owner, points], i) => {
    const color = colors[i % colors.length];
    return {
      label: owner.split(' ')[0],
      backgroundColor: color,
      borderColor: color,
      borderWidth: 2,
      pointRadius: 0,
      data: dates.map((date, i) => {
        yMax = Math.max(yMax, points[i]);
        return { x: date, y: Math.round(points[i]) };
      }),
    };
  });

  const yTick = yMax < 5000 ? 500 : yMax < 10000 ? 1000 : 2000;

  return {
    options: {
      animation: false,
      normalized: true,
      parsing: false,
      // show the tooltip when hovering over a time on the graph (not just over the points/lines)
      interaction: { intersect: false, mode: 'index' },
      scales: {
        x: {
          type: 'time',
          time: { minUnit: 'day', tooltipFormat: 'D MMMM YYYY' },
          // keep rotation consistent while zooming
          ticks: { maxRotation: 45, minRotation: 45 },
        },
        y: {
          type: 'linear',
          // use the next multiple of yTick as the max
          max: Math.ceil(yMax / yTick) * yTick,
          ticks: { stepSize: yTick },
        },
      },
      plugins: {
        legend: {
          position: 'bottom',
        },
        tooltip: {
          boxPadding: 4,
          itemSort: (a, b) => a.element.y - b.element.y,
        },
        // https://www.chartjs.org/chartjs-plugin-zoom/guide/options.html
        zoom: {
          limits: {
            // can't zoom out beyond original data set or in beyond 4 weeks
            x: { min: 'original', max: 'original', minRange: 1000 * 60 * 60 * 24 * 7 * 4 },
          },
          pan: {
            enabled: true,
            mode: 'x',
            modifierKey: 'shift',
          },
          zoom: {
            drag: { enabled: true },
            wheel: { enabled: true },
            pinch: { enabled: true },
            mode: 'x',
          },
        },
      },
    },
    data: {
      datasets,
    },
  };
}

const colors = [
  'deepskyblue',
  'darkorchid',
  'limegreen',
  'orange',
  'magenta',
  'blue',
  'red',
  'forestgreen',
  'cornflowerblue',
  'teal',
  'olivedrab',
  'mediumaquamarine',
  'brown',
];
