import { NextRouter } from 'next/router';

import { Filter } from '../components/Dashboard';

export const pushFilterToRouter = (filter: Filter, router: NextRouter) => {
  const { slug } = router.query;
  let { time, tag, location, locationType } = router.query;

  if (filter.timePeriod) {
    time = filter.timePeriod !== 'ALL' ? filter.timePeriod : null;
  }

  if (filter.tag) {
    tag = filter.tag !== 'ALL' && tag !== filter.tag ? filter.tag : null;
  }

  if (filter.location) {
    location = filter.location.value;
    locationType = filter.location.type;
  }

  router.push(
    {
      pathname: `/${slug ?? ''}`,
      query: {
        ...(time && { time }),
        ...(location && { location }),
        ...(locationType && { locationType }),
        ...(tag && { tag }),
      },
    },
    null,
    {
      shallow: true,
    },
  );
};
