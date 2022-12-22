const getCollectiveStats = stats => {
  const raisedSeries = {
    timeUnit: stats.totalAmountReceivedTimeSeries.timeUnit,
    nodes: stats.totalAmountReceivedTimeSeries.nodes.map(node => ({
      date: node.date,
      amount: node.amount.valueInCents,
    })),
  };
  const raised = raisedSeries.nodes.reduce((acc, node) => acc + node.amount, 0);
  const spent = Math.abs(stats.totalAmountSpent.valueInCents);

  return {
    contributors: stats.contributorsCount,
    spent,
    raised,
    raisedSeries,
  };
};

export const getAllCollectiveStats = collective => {
  const stats = {
    ALL: getCollectiveStats(collective.ALL),
    PAST_YEAR: getCollectiveStats(collective.PAST_YEAR),
    PAST_QUARTER: getCollectiveStats(collective.PAST_QUARTER),
  };
  return stats.ALL.raised !== 0 ? stats : null;
};

export function getTotalStats(collectives, timePeriod) {
  return collectives?.reduce(
    (acc, collective) => {
      if (!collective.stats?.[timePeriod]) {
        return acc;
      }
      return {
        collectivesCount: collectives.length,
        raised: acc.raised + collective.stats[timePeriod].raised,
        totalContributors: acc.totalContributors + collective.stats[timePeriod].contributors,
      };
    },
    {
      collectivesCount: 0,
      raised: 0,
      totalContributors: 0,
    },
  );
}
