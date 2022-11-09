import React, { useMemo } from 'react';
import { ApexOptions } from 'apexcharts';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { get, max, min } from 'lodash';
import dynamic from 'next/dynamic';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
// import ApexChart from "react-apexcharts";
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
  border-radius: 16px;
`;

const getChartOptions = (intl, timeUnit, hostCurrency, isCompactNotation): ApexOptions => ({
  chart: {
    id: 'chart-total-received',
    toolbar: { show: false },
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
    horizontalAlign: 'left',
  },
  colors: ['#29CC75', '#F55882'],
  xaxis: {
    labels: {
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
      minWidth: 38,
      formatter: value => formatAmountForLegend(value, hostCurrency, intl.locale, isCompactNotation),
    },
  },
  tooltip: {
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

  nodes.forEach(({ date, amount, kind }) => {
    if (!keyedData[date]) {
      keyedData[date] = { x: date, y: 0, kinds: {} };
      console.log('never logs');
    }

    keyedData[date].y += amount.value;
    keyedData[date]['kinds'][kind] = amount.value;
  });

  return Object.values(keyedData);
};

const getSeriesFromData = (intl, timeSeries, startYear) => {
  const totalReceivedNodes = get(timeSeries, 'nodes', []);
  const totalReceivedData = getSeriesDataFromTotalReceivedNodes(totalReceivedNodes, startYear);

  return [
    {
      name: intl.formatMessage({ defaultMessage: 'Total Contributions' }),
      data: totalReceivedData,
    },
  ];
};

export default function Chart({ timeSeries }) {
  const currency = 'USD';
  const intl = useIntl();

  const startYear = 2015;
  const series = useMemo(() => getSeriesFromData(intl, timeSeries, startYear), [timeSeries]);

  const isCompactNotation = getMinMaxDifference(series[0].data) >= 10000;
  const chartOptions = useMemo(
    () => getChartOptions(intl, timeSeries.timeUnit, currency, isCompactNotation),
    [timeSeries.timeUnit],
  );

  return (
    <ChartWrapper>
      <ApexChart type="area" width="100%" height="250px" options={chartOptions} series={series} />
    </ChartWrapper>
  );
}
