import React, { useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import { FormattedDate } from 'react-intl';
import sanitizeHtml from 'sanitize-html';

import { getAllPossibleTagValues } from '../utils/tag-helpers';

import CollectiveButton from './CollectiveButton';
import { PaginationControls } from './PaginationControls';

export const updatesQuery = gql`
  query Updates($host: [AccountReferenceInput], $tag: [String], $limit: Int, $offset: Int) {
    updates(host: $host, accountTag: $tag, accountType: [COLLECTIVE, FUND], limit: $limit, offset: $offset) {
      totalCount
      offset
      nodes {
        id
        title
        createdAt
        slug
        summary
        account {
          slug
          imageUrl
          name
        }
        fromAccount {
          id
          name
          imageUrl
        }
      }
    }
  }
`;

export default function Updates({ host, filter, openCollectiveModal }) {
  const [pageIndex, setPageIndex] = React.useState(0);
  const limit = 6;

  const { data, loading, fetchMore, error } = useQuery(updatesQuery, {
    variables: {
      host: host.hostSlugs ? host.hostSlugs.map(slug => ({ slug })) : { slug: host.slug },
      ...(filter.tag !== 'ALL' && { tag: getAllPossibleTagValues(filter.tag, host.groupTags) }),
      limit,
      offset: 0,
    },
    notifyOnNetworkStatusChange: true,
  });

  const loadingNodes = Array(limit)
    .fill({})
    .map((_, i) => ({ id: i, loading: true }));
  const [nodes, setNodes] = React.useState<any[]>(loadingNodes);

  useEffect(() => {
    setPageIndex(0);
  }, [filter.tag, filter.slug]);

  useEffect(() => {
    const currentPageNodes = data?.updates.nodes.slice(pageIndex * limit, (pageIndex + 1) * limit);
    if (loading) {
      setNodes(loadingNodes);
    } else if (currentPageNodes?.length) {
      setNodes(currentPageNodes);
    } else {
      setNodes([]);
    }
  }, [data, loading, pageIndex]);

  const totalPageLength = Math.ceil(data?.updates.totalCount / limit);

  // limit to 3 pages
  const pageLength = totalPageLength > 3 ? 3 : totalPageLength;

  return (
    <div className="px-4 pb-6 lg:px-0">
      <h2 className="mb-6  text-xl font-bold text-gray-600 lg:text-4xl">Updates from collectives</h2>
      <div className="space-y-4">
        {nodes?.map(update => {
          return (
            <div key={update.id} className="fadeIn rounded-lg bg-white p-2 lg:p-4">
              {update.loading ? (
                <div className="fadeIn">
                  <div role="status" className="animate-pulse space-y-3 p-2 lg:space-y-4 lg:p-4 lg:pb-2">
                    <div className="flex items-center justify-between">
                      <div className="h-6 w-4/12 rounded-full bg-gray-200 lg:h-7"></div>
                      <div className="hidden h-5 w-24 rounded-full bg-gray-100 lg:block"></div>
                    </div>
                    <div className="h-5 w-10/12 rounded-full bg-gray-100 lg:h-6"></div>
                    <div className="flex items-center gap-4 pt-1">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-md bg-gray-100"></div>
                        <div className="h-5 w-32 rounded-full bg-gray-100"></div>
                      </div>
                      <div className="hidden items-center gap-2 lg:flex">
                        <div className="h-6 w-6 rounded-full bg-gray-100"></div>

                        <div className="h-5  w-32 rounded-full bg-gray-100"></div>
                      </div>
                    </div>
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              ) : (
                <div className="fadeIn flex flex-col gap-1 ">
                  <a
                    className=" relative mb-0  block space-y-2 overflow-hidden rounded-lg p-2 transition-colors duration-100 hover:bg-gray-50 lg:p-4 "
                    href={`https://opencollective.com/${update.account.slug}/updates/${update.slug}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <div className="flex items-center justify-between gap-6">
                      <h3 className="flex-shrink overflow-hidden text-ellipsis whitespace-nowrap  text-base font-medium text-gray-900 group-hover:underline lg:text-xl">
                        {update.title}
                      </h3>
                      <p className="hidden  flex-shrink-0 text-gray-600 lg:block">
                        <FormattedDate dateStyle={'medium'} value={update.createdAt} />
                      </p>
                    </div>
                    <p className="overflow-hidden text-ellipsis whitespace-nowrap text-sm text-gray-500 lg:text-base">
                      {sanitizeHtml(update.summary, { allowedTags: [], allowedAttributes: {} })}
                    </p>
                  </a>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                      <CollectiveButton collective={update.account} openCollectiveModal={openCollectiveModal} />
                      <span className="align-items hidden gap-2 lg:flex">
                        <img
                          src={update.fromAccount.imageUrl.replace('-staging', '')}
                          alt={update.fromAccount.name}
                          className="h-4 w-4 rounded-full object-cover lg:h-6 lg:w-6"
                        />
                        <span className="text-sm font-medium">{update.fromAccount.name}</span>
                      </span>
                    </div>
                    <p className="block flex-shrink-0  text-sm text-gray-600 lg:hidden">
                      <FormattedDate dateStyle={'short'} value={update.createdAt} />
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {error && <span>error.message</span>}
        <PaginationControls
          pageIndex={pageIndex}
          pageLength={pageLength ?? 1}
          canPreviousPage={pageIndex > 0}
          canNextPage={!loading && pageIndex + 1 < pageLength}
          previousPage={() => setPageIndex(pageIndex - 1)}
          nextPage={() => {
            fetchMore({
              variables: {
                offset: data?.updates.nodes.length,
              },
            });
            setPageIndex(pageIndex + 1);
          }}
        />
      </div>
    </div>
  );
}
