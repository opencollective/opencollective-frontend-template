export function computeStats(collectives, currency) {
  return collectives.reduce(
    (acc, collective) => {
      return {
        ALL: {
          totalNetRaised: {
            valueInCents: acc.ALL.totalNetRaised.valueInCents + collective.stats.ALL.totalNetRaised.valueInCents,
            currency,
          },
          totalContributions: acc.ALL.totalContributions + collective.stats.ALL.contributions,
          totalContributors: acc.ALL.totalContributors + collective.stats.ALL.contributors,
        },
        PAST_YEAR: {
          totalNetRaised: {
            valueInCents:
              acc.PAST_YEAR.totalNetRaised.valueInCents + collective.stats.PAST_YEAR.totalNetRaised.valueInCents,
            currency,
          },
          totalContributions: acc.PAST_YEAR.totalContributions + collective.stats.PAST_YEAR.contributions,
          totalContributors: acc.PAST_YEAR.totalContributors + collective.stats.PAST_YEAR.contributors,
        },

        PAST_QUARTER: {
          totalNetRaised: {
            valueInCents:
              acc.PAST_QUARTER.totalNetRaised.valueInCents + collective.stats.PAST_QUARTER.totalNetRaised.valueInCents,
            currency,
          },
          totalContributions: acc.PAST_QUARTER.totalContributions + collective.stats.PAST_QUARTER.contributions,
          totalContributors: acc.PAST_QUARTER.totalContributors + collective.stats.PAST_QUARTER.contributors,
        },
      };
    },
    {
      ALL: {
        totalNetRaised: { valueInCents: 0, currency },
        totalContributions: 0,
        totalContributors: 0,
      },
      PAST_YEAR: {
        totalNetRaised: { valueInCents: 0, currency },
        totalContributions: 0,
        totalContributors: 0,
      },
      PAST_QUARTER: {
        totalNetRaised: { valueInCents: 0, currency },
        totalContributions: 0,
        totalContributors: 0,
      },
    },
  );
}

export function computeTimeSeries(categoriesWithFilteredData) {
  const categoriesTimeSeries = categoriesWithFilteredData.map(category => {
    const timeSeries = category.collectives.reduce(
      (acc, node) => {
        node.stats.ALL.totalNetRaisedTimeSeries.forEach(timeSeries => {
          const key = timeSeries.date;
          if (!acc.ALL[key]) {
            acc.ALL[key] = {
              date: timeSeries.date,
              amount: { valueInCents: 0, currency: timeSeries.amount.currency },
            };
          }
          acc.ALL[key].amount.valueInCents += timeSeries.amount.valueInCents;
        });
        node.stats.PAST_QUARTER.totalNetRaisedTimeSeries.forEach(timeSeries => {
          const key = timeSeries.date;
          if (!acc.PAST_QUARTER[key]) {
            acc.PAST_QUARTER[key] = {
              date: timeSeries.date,
              amount: { valueInCents: 0, currency: timeSeries.amount.currency },
            };
          }
          acc.PAST_QUARTER[key].amount.valueInCents += timeSeries.amount.valueInCents;
        });
        node.stats.PAST_YEAR.totalNetRaisedTimeSeries.forEach(timeSeries => {
          const key = timeSeries.date;
          if (!acc.PAST_YEAR[key]) {
            acc.PAST_YEAR[key] = {
              date: timeSeries.date,
              amount: { valueInCents: 0, currency: timeSeries.amount.currency },
            };
          }
          acc.PAST_YEAR[key].amount.valueInCents += timeSeries.amount.valueInCents;
        });
        return { ...acc };
      },
      { ALL: {}, PAST_QUARTER: {}, PAST_YEAR: {} },
    );

    return {
      ALL: {
        label: category.label,
        color: category.color,
        tag: category.tag,
        timeUnit: 'YEAR',
        nodes: Object.values(timeSeries.ALL),
      },
      PAST_QUARTER: {
        label: category.label,
        color: category.color,
        tag: category.tag,

        timeUnit: 'WEEK',
        nodes: Object.values(timeSeries.PAST_QUARTER),
      },
      PAST_YEAR: {
        label: category.label,
        color: category.color,
        tag: category.tag,

        timeUnit: 'MONTH',
        nodes: Object.values(timeSeries.PAST_YEAR),
      },
    };
  });
  return categoriesTimeSeries.reduce(
    (acc, category) => {
      return {
        ALL: [...acc.ALL, category.ALL],
        PAST_QUARTER: [...acc.PAST_QUARTER, category.PAST_QUARTER],
        PAST_YEAR: [...acc.PAST_YEAR, category.PAST_YEAR],
      };
    },
    { ALL: [], PAST_QUARTER: [], PAST_YEAR: [] },
  );
}
