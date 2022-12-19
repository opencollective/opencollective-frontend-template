import React from 'react';

import { formatCurrency } from '@opencollective/frontend-components/lib/currency-utils';

const Metric = ({ value, label }: { label: string; value: string }) => {
  return (
    <div className="p-2 text-center">
      <p className="mb-0.5 text-xl font-bold lg:text-3xl lg:font-medium">{value}</p>
      <span className="text-sm text-gray-700 lg:text-lg">{label}</span>
    </div>
  );
};

export default function Stats({ currency, locale, stats }) {
  const { raised, totalContributions, totalContributors, collectivesCount } = stats;
  return (
    <div className="-mb-2 grid grid-cols-1 divide-y px-4 lg:grid-cols-4 lg:divide-y-0 lg:divide-x lg:px-8">
      <Metric value={collectivesCount?.toLocaleString(locale)} label="Collectives" />
      <Metric
        value={formatCurrency(raised, currency, {
          locale,
          precision: 0,
        })}
        label="Total raised"
      />
      <Metric value={totalContributions.toLocaleString(locale)} label="Contributions" />
      <Metric value={totalContributors.toLocaleString(locale)} label="Contributors" />
    </div>
  );
}
