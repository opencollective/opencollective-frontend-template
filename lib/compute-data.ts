export function computeStats(collectives, timePeriod) {
  return collectives.reduce(
    (acc, collective) => {
      if (!collective.stats?.[timePeriod]) {
        return acc;
      }
      return {
        collectivesCount: collectives.length,
        raised: acc.raised + collective.stats[timePeriod].raised,
        totalContributions: acc.totalContributions + collective.stats[timePeriod].contributions,
        totalContributors: acc.totalContributors + collective.stats[timePeriod].contributors,
      };
    },
    {
      collectivesCount: 0,
      raised: 0,
      totalContributions: 0,
      totalContributors: 0,
    },
  );
}

export function computeTimeSeries(categoriesWithFilteredData, timePeriod) {
  const categoriesTimeSeries = categoriesWithFilteredData.map(category => {
    const timeSeries = category.collectives.reduce(
      (acc, collective) => {
        const collectiveSeries = collective.stats?.[timePeriod]?.raisedSeries;
        if (!collectiveSeries) {
          return acc;
        }
        acc.timeUnit = collectiveSeries.timeUnit;
        collectiveSeries.nodes.forEach(node => {
          const key = node.date;
          if (!acc.nodes[key]) {
            acc.nodes[key] = {
              date: node.date,
              amount: 0,
            };
          }
          acc.nodes[key].amount += node.amount;
        });

        return acc;
      },
      { timeUnit: undefined, nodes: {} },
    );

    return {
      label: category.label,
      color: category.color.hex,
      tag: category.tag,
      timeUnit: timeSeries.timeUnit,
      nodes: Object.values(timeSeries.nodes),
    };
  });
  return categoriesTimeSeries;
}
