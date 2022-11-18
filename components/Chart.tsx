import React, { useMemo } from 'react';
import { ApexOptions } from 'apexcharts';
import dayjs from 'dayjs';
import { get, max, min } from 'lodash';
import dynamic from 'next/dynamic';
import { useIntl } from 'react-intl';
import styled from 'styled-components';

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export const formatAmountForLegend = (value, type, currency, locale, isCompactNotation = true) => {
  return new Intl.NumberFormat(locale, {
    currency,
    style: type === 'amount' ? 'currency' : 'decimal',
    notation: isCompactNotation ? 'compact' : 'standard',
  }).format(value);
};

export const getMinMaxDifference = data => {
  const numberArray = data.map(({ y }) => y);
  const minVal = min(numberArray);
  const maxVal = max(numberArray);
  return maxVal - minVal;
};

export const ChartWrapper = styled.div`
  position: relative;
  height: 300px;
  z-index: 1;
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

const getChartOptions = (intl, timeUnit, hostCurrency, isCompactNotation, colors, type): ApexOptions => ({
  chart: {
    id: 'totalRaised',
    toolbar: { show: false },
    fontFamily: "'Inter', sans-serif",
    background: '#FFFFFF',
    zoom: { enabled: false },
  },
  stroke: {
    curve: 'straight',
    width: 3,
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
    show: false,
    showForSingleSeries: false,
    fontSize: '14px',
    position: 'top',
    offsetY: 10,
    floating: true,
    horizontalAlign: 'center',
    onItemClick: {
      toggleDataSeries: true,
    },
  },
  colors,
  xaxis: {
    labels: {
      style: {
        fontSize: '14px',
      },
      formatter: function (value) {
        if (timeUnit === 'YEAR') {
          return dayjs(value).utc().year().toString();
        } else if (timeUnit === 'MONTH') {
          if (dayjs(value).utc().month() === 0) {
            return dayjs(value).utc().format('MMM YYYY');
          }
          return dayjs(value).utc().format('MMM');
        } else if (timeUnit === 'WEEK') {
          return `W${dayjs(value).utc().isoWeek()}`;
        } else if (timeUnit === 'DAY') {
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
      formatter: value => formatAmountForLegend(value, type, hostCurrency, intl.locale, isCompactNotation),
    },
  },
  tooltip: {
    style: {
      fontSize: '14px',
    },
    y: {
      formatter: value => formatAmountForLegend(value, type, hostCurrency, intl.locale, false),
    },
  },
});

const getSeriesDataFromNodes = (nodes, startYear, currentTimePeriod, type) => {
  const keyedData = {};
  const currentYear = new Date().getUTCFullYear();

  if (currentTimePeriod === 'ALL') {
    for (let year = startYear; year <= currentYear; year++) {
      const date = new Date(Date.UTC(year, 0, 1, 0, 0, 0)).toISOString();

      keyedData[date] = {
        x: date,
        y: 0,
        kinds: {},
      };
    }
  }

  nodes.forEach(({ date, amount, count }) => {
    if (!keyedData[date]) {
      keyedData[date] = { x: date, y: 0, kinds: {} };
    }
    keyedData[date].y += type === 'amount' ? amount.value : count;
  });

  return Object.values(keyedData);
};

const getSeriesFromData = (intl, timeSeriesArray, startYear, currentTimePeriod, type) => {
  const series = timeSeriesArray?.map(timeSeries => {
    const totalReceivedNodes = get(timeSeries, 'nodes', []);
    const totalReceivedData = getSeriesDataFromNodes(totalReceivedNodes, startYear, currentTimePeriod, type);

    return {
      name: timeSeries.label,
      data: totalReceivedData,
    };
  });

  return series;
};

export default function Chart({ timeSeriesArray, startYear, currentTag, type, currentTimePeriod }) {
  const currency = 'USD';
  const intl = useIntl();
  const series = useMemo(
    () => getSeriesFromData(intl, timeSeriesArray, startYear, currentTimePeriod, type),
    [currentTag, type, currentTimePeriod],
  );
  // useEffect(() => {
  //   if (typeof window !== 'undefined') window.ApexCharts = Apppex;
  // });
  const isCompactNotation = true; // getMinMaxDifference(series[0].data) >= 10000;
  const colors = timeSeriesArray.map(s => s.color);
  const chartOptions = useMemo(
    () => getChartOptions(intl, timeSeriesArray[0].timeUnit, currency, isCompactNotation, colors, type),
    [currentTag, type, currentTimePeriod],
  );

  return (
    <ChartWrapper>
      <div className="loading">Loading...</div>
      <ApexChart type="area" width="100%" height="300px" options={chartOptions} series={series} />
    </ChartWrapper>
  );
}
