import React, { useMemo } from 'react';
import { ApexOptions } from 'apexcharts';
import dayjs from 'dayjs';
import { get, max, min } from 'lodash';
import dynamic from 'next/dynamic';
import { useIntl } from 'react-intl';
import styled from 'styled-components';

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

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

export const ChartWrapper = styled.div`
  position: relative;
  height: 270px;
  z-index: 1;
  .loading {
    position: absolute;
    top: 50%;
    left: 50%;
    color: #888;
    -webkit-user-select: none;
    user-select: none;
  }
  .apexcharts-legend {
    padding: 0 60px;
  }
  .apexcharts-legend-series {
    padding: 4px;
    & > span {
      vertical-align: middle;
    }
  }

  .apexcharts-legend-marker {
    margin-right: 4px;
  }
`;

const getChartOptions = (intl, timeUnit, hostCurrency, isCompactNotation, colors): ApexOptions => ({
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
    show: true,
    showForSingleSeries: false,
    fontSize: '12px',
    position: 'top',
    offsetY: 10,
    floating: true,
    horizontalAlign: 'center',
    onItemClick: {
      toggleDataSeries: false,
    },
  },
  colors,
  xaxis: {
    labels: {
      style: {
        fontSize: '12px',
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
        fontSize: '12px',
      },
      minWidth: 38,
      formatter: value => formatAmountForLegend(value, hostCurrency, intl.locale, isCompactNotation),
    },
  },
  tooltip: {
    style: {
      fontSize: '12px',
    },
    y: {
      formatter: value => formatAmountForLegend(value, hostCurrency, intl.locale, false),
    },
  },
});

const getSeriesDataFromNodes = (nodes, startYear, timePeriod) => {
  const keyedData = {};

  if (timePeriod === 'ALL') {
    const years = dayjs.utc().year() - startYear;
    for (let year = years; year > 0; year--) {
      const date = dayjs.utc().subtract(year, 'year').startOf('year').toISOString();
      keyedData[date] = {
        x: date,
        y: 0,
      };
    }
  } else if (timePeriod === 'PAST_YEAR') {
    for (let month = 12; month >= 0; month--) {
      const date = dayjs.utc().subtract(month, 'month').startOf('month').toISOString();

      keyedData[date] = {
        x: date,
        y: 0,
      };
    }
  } else if (timePeriod === 'PAST_QUARTER') {
    for (let week = 12; week >= 0; week--) {
      const date = dayjs.utc().subtract(week, 'week').startOf('isoWeek').toISOString();

      keyedData[date] = {
        x: date,
        y: 0,
      };
    }
  }
  nodes.forEach(({ date, amount }) => {
    if (keyedData[date]) {
      keyedData[date].y += amount / 100;
    }
  });

  return Object.values(keyedData);
};

const getSeriesFromData = (intl, timeSeriesArray, startYear, timePeriod) => {
  const series = timeSeriesArray?.map(timeSeries => {
    const totalReceivedNodes = get(timeSeries, 'nodes', []);
    const totalReceivedData = getSeriesDataFromNodes(totalReceivedNodes, startYear, timePeriod);

    return {
      name: timeSeries.label,
      data: totalReceivedData,
    };
  });

  return series;
};

export default function Chart({ timeSeriesArray, startYear, filter, currency }) {
  const intl = useIntl();
  const series = useMemo(
    () => getSeriesFromData(intl, timeSeriesArray, startYear, filter.timePeriod),
    [JSON.stringify(filter)],
  );
  const isCompactNotation = true; // getMinMaxDifference(series[0].data) >= 10000;
  const colors = timeSeriesArray.map(s => s.color);
  const chartOptions = useMemo(
    () => getChartOptions(intl, timeSeriesArray[0].timeUnit, currency, isCompactNotation, colors),
    [JSON.stringify(filter)],
  );

  return (
    <ChartWrapper>
      <div className="loading">Loading...</div>
      <ApexChart type="area" width="100%" height="270px" options={chartOptions} series={series} />
    </ChartWrapper>
  );
}
