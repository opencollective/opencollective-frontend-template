import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { Flipped, Flipper } from 'react-flip-toolkit';
import { FormattedDate } from 'react-intl';
import sanitizeHtml from 'sanitize-html';

import { reverseTagTransform } from '../lib/tag-transforms';

import CollectiveButton from './CollectiveButton';

export const updatesQuery = gql`
  query Updates($host: [AccountReferenceInput], $tag: [String], $limit: Int) {
    updates(host: $host, tag: $tag, limit: $limit) {
      totalCount
      nodes {
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
  const { data } = useQuery(updatesQuery, {
    variables: {
      host: host.hostSlugs ? host.hostSlugs.map(slug => ({ slug })) : { slug: host.slug },
      ...(filter.tag !== 'ALL' && { tag: reverseTagTransform(filter.tag) }),
      limit: 3,
    },
  });

  return (
    <div className="px-4 pb-6 lg:px-0">
      <h2 className="mb-6  text-xl font-bold text-gray-600 lg:text-4xl">Updates from collectives</h2>
      <Flipper flipKey={filter.tag}>
        <div className="min-h-[440px] space-y-4 lg:min-h-[560px]">
          {data?.updates.nodes.map(update => {
            return (
              <Flipped flipId={update.createdAt} key={update.createdAt}>
                <div className="fadeIn flex flex-col gap-1 rounded-lg bg-white p-2 lg:p-4">
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
              </Flipped>
            );
          })}
        </div>
      </Flipper>
    </div>
  );
}
