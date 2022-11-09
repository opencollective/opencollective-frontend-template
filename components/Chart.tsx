import React, { useMemo } from 'react';
import { ApexOptions } from 'apexcharts';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { get, max, min } from 'lodash';
import dynamic from 'next/dynamic';
import { useIntl } from 'react-intl';
import styled from 'styled-components';

dayjs.extend(utc);

export const formatAmountForLegend = (value, currency, locale, isCompactNotation = true) => {
  return new Intl.NumberFormat(locale, {
    currency,
    style: 'currency',
    notation: isCompactNotation ? 'compact' : 'standard',
  }).format(value);
};

export const getMinMaxDifference = data => {
  const numberArray = data.map(({ y }) => y);
  const minVal = min(numberArray);
  const maxVal = max(numberArray);
  return maxVal - minVal;
};

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export const ChartWrapper = styled.div`
  position: relative;
  background: white;
  padding: 16px;
  height: 332px;
  border-radius: 16px;
  .loading {
    position: absolute;
    top: 50%;
    left: 50%;
    color: #888;
    -webkit-user-select: none;
    user-select: none;
  }
  .apexcharts-legend-series {
    padding: 8px;
    & > span {
      vertical-align: middle;
    }
  }

  .apexcharts-legend-marker {
    margin-right: 8px;
  }
`;

const getChartOptions = (intl, timeUnit, hostCurrency, isCompactNotation, colors): ApexOptions => ({
  chart: {
    id: 'chart-total-received',
    toolbar: { show: false },
    fontFamily: "'Inter', sans-serif",
    background: '#FFFFFF',
  },
  stroke: {
    curve: 'straight',
    width: 2,
  },
  markers: {
    size: 6,
  },
  grid: {
    xaxis: { lines: { show: true } },
    yaxis: { lines: { show: false } },
  },
  dataLabels: {
    enabled: false,
  },
  legend: {
    show: true,
    showForSingleSeries: false,
    fontSize: '14px',
    position: 'top',
    offsetY: 0,
    floating: true,
    horizontalAlign: 'center',
  },
  colors,
  xaxis: {
    labels: {
      style: {
        fontSize: '14px',
      },
      formatter: function (value) {
        // Show data aggregated yearly
        if (timeUnit === 'YEAR') {
          return dayjs(value).utc().year().toString();
          // Show data aggregated monthly
        } else if (timeUnit === 'MONTH') {
          return dayjs(value).utc().format('MMM-YYYY');
          // Show data aggregated by week or day
        } else if (timeUnit === 'WEEK' || timeUnit === 'DAY') {
          return dayjs(value).utc().format('DD-MMM-YYYY');
        }
      },
    },
  },
  yaxis: {
    labels: {
      style: {
        fontSize: '14px',
      },
      minWidth: 38,
      formatter: value => formatAmountForLegend(value, hostCurrency, intl.locale, isCompactNotation),
    },
  },
  tooltip: {
    style: {
      fontSize: '14px',
    },
    y: {
      formatter: value => formatAmountForLegend(value, hostCurrency, intl.locale, false), // Never use compact notation in tooltip
    },
  },
});

const getSeriesDataFromTotalReceivedNodes = (nodes, startYear) => {
  const keyedData = {};
  const currentYear = new Date().getUTCFullYear();

  // create empty data for each year
  for (let year = startYear; year <= currentYear; year++) {
    const date = new Date(Date.UTC(year, 0, 1, 0, 0, 0)).toISOString();

    keyedData[date] = {
      x: date,
      y: 0,
      kinds: {},
    };
  }

  nodes.forEach(({ date, amount }) => {
    keyedData[date].y += amount.value;
  });

  return Object.values(keyedData);
};

const getSeriesFromData = (intl, timeSeriesArray, startYear) => {
  const series = timeSeriesArray?.map(timeSeries => {
    const totalReceivedNodes = get(timeSeries, 'nodes', []);
    const totalReceivedData = getSeriesDataFromTotalReceivedNodes(totalReceivedNodes, startYear);

    return {
      name: timeSeries.label,
      data: totalReceivedData,
    };
  });

  return series;
};

export default function Chart({ timeSeriesArray, startYear, currentTag }) {
  const currency = 'USD';
  const intl = useIntl();

  const series = useMemo(() => getSeriesFromData(intl, timeSeriesArray, startYear), [currentTag]);

  const isCompactNotation = getMinMaxDifference(series[0].data) >= 10000;
  const colors = timeSeriesArray.map(s => s.color);
  const chartOptions = useMemo(() => getChartOptions(intl, 'YEAR', currency, isCompactNotation, colors), [currentTag]);

  return (
    <ChartWrapper>
      <div className="loading">Loading...</div>
      <ApexChart type="area" width="100%" height="300px" options={chartOptions} series={series} />
    </ChartWrapper>
  );
}
