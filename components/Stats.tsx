import React from 'react';

import { formatCurrency } from '@opencollective/frontend-components/lib/currency-utils';

const Metric = ({ value, label }: { label: string; value: string }) => {
  return (
    <div className="text-center">
      <p className="mb-0.5 text-lg font-semibold lg:text-3xl">{value}</p>
      <span className="text-sm text-gray-700 lg:text-lg">{label}</span>
    </div>
  );
};

export default function Stats({ currency, locale, stats }) {
  const { raised, totalContributors, collectivesCount } = stats;
  return (
    <div className="-mb-2 grid grid-cols-3 gap-1 px-1 lg:divide-x lg:divide-y-0 lg:px-8">
      <Metric value={collectivesCount?.toLocaleString(locale)} label="Collectives" />
      <Metric
        value={formatCurrency(raised, currency, {
          locale,
          precision: 0,
        })}
        label="Total raised"
      />
      <Metric value={totalContributors.toLocaleString(locale)} label="Contributors" />
    </div>
  );
}
