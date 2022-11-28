import React from 'react';

import { formatCurrency } from '@opencollective/frontend-components/lib/currency-utils';

const Metric = ({ value, label }: { label: string; value: string }) => {
  return (
    <div className="p-2 text-center">
      <p className="mb-0.5 text-xl font-bold md:text-3xl md:font-medium">{value}</p>
      <span className="text-sm text-gray-700 md:text-lg">{label}</span>
    </div>
  );
};

export default function Stats({ collectiveCount, totalRaised, locale, numberOfContributions }) {
  return (
    <div className="-mb-2 grid grid-cols-1 divide-y px-4 md:grid-cols-3 md:divide-y-0 md:divide-x md:px-8">
      <Metric value={collectiveCount.toLocaleString(locale)} label="Collectives" />
      <Metric
        value={formatCurrency(totalRaised.valueInCents, totalRaised.currency, { locale, precision: 0 })}
        label="Total raised"
      />
      <Metric value={numberOfContributions.toLocaleString(locale)} label="Contributions" />
    </div>
  );
}
