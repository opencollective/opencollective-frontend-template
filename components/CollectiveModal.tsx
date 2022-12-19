import React, { Fragment, useEffect, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { Dialog, Transition } from '@headlessui/react';
import AnimateHeight, { Height } from 'react-animate-height';
import { FormattedDate } from 'react-intl';
import sanitizeHtml from 'sanitize-html';

import { formatCurrency } from '@opencollective/frontend-components/lib/currency-utils';

import { CloseIcon } from './Icons';
import LocationTag from './LocationTag';
import { Avatar } from './Table';

export const collectiveQuery = gql`
  query Account($slug: String!) {
    account(slug: $slug) {
      id
      slug
      createdAt
      description
      updates(limit: 3) {
        totalCount
        nodes {
          title
          createdAt
          slug
          summary
          fromAccount {
            id
            name
            imageUrl
          }
        }
      }
    }
  }
`;
export default function CollectiveModal({ isOpen, onClose, collective, locale = 'en', setFilter, currency }) {
  const { data } = useQuery(collectiveQuery, {
    variables: { slug: collective?.slug },
    skip: !collective,
  });
  const [height, setHeight] = useState<Height>(0);

  useEffect(() => {
    if (data?.account) {
      setHeight('auto');
    } else {
      setHeight(0);
    }
  }, [data]);
  if (!collective) {
    return null;
  }
  return (
    <React.Fragment>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-30" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="flex items-center gap-4 text-xl font-medium text-gray-900">
                    <Avatar src={collective?.imageUrl} height="40px" width="40px" alt={collective?.name} />
                    <span>{collective?.name}</span>
                  </Dialog.Title>
                  <button
                    className="absolute right-6 top-5 flex h-12 w-12 items-center justify-center rounded-full border text-gray-600 hover:bg-gray-50"
                    onClick={onClose}
                  >
                    <CloseIcon className="" />
                  </button>
                  <AnimateHeight id="description" duration={500} height={height}>
                    <div className="mt-3">
                      <p className="text-base text-gray-500">{data?.account?.description}</p>
                    </div>
                  </AnimateHeight>
                  {(collective.tags?.length > 0 || collective.location?.label) && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {collective.location && (
                        <LocationTag
                          setLocationFilter={filter => setFilter({ location: filter })}
                          location={collective.location}
                        />
                      )}
                      {collective?.tags?.map(tag => (
                        <span key={tag} className="rounded-full bg-gray-100 px-2 py-1 text-sm text-gray-700">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 grid grid-cols-4 gap-1 rounded bg-gray-50 p-4 text-sm text-gray-600">
                    <div className="text-black">Total disbursed</div>
                    <div>
                      {formatCurrency(Math.abs(collective.stats?.ALL.spent), currency, {
                        locale,
                        precision: 0,
                      })}
                    </div>
                    <div className="text-black">Total raised</div>
                    <div>
                      {formatCurrency(collective.stats?.ALL.raised, currency, {
                        locale,
                        precision: 0,
                      })}
                    </div>
                    <div className="text-black">Contributors</div>{' '}
                    <div>{collective.stats?.ALL.contributors.toLocaleString(locale)}</div>
                    <div className="text-black">Contributions</div>{' '}
                    <div>{collective.stats?.ALL.contributions.toLocaleString(locale)}</div>
                    <div className="text-black">Created</div>
                    <div>
                      {data?.account?.createdAt && (
                        <FormattedDate dateStyle={'medium'} value={data.account.createdAt} />
                      )}
                    </div>
                  </div>
                  <AnimateHeight id="updates" duration={500} height={height}>
                    {data?.account?.updates?.nodes?.length > 0 && (
                      <React.Fragment>
                        <h4 className="mt-4 mb-1 text-sm text-gray-500">Latest updates</h4>
                        <div className="flex flex-col gap-2">
                          {data.account?.updates?.nodes?.map(update => (
                            <a
                              key={update.slug}
                              href={`https://opencollective.com/${collective.slug}/updates/${update.slug}`}
                              className="flex items-center gap-3 rounded-md p-2 transition-colors duration-100 hover:bg-gray-50"
                              target="_blank"
                              rel="noreferrer"
                            >
                              <img
                                src={update.fromAccount.imageUrl.replace('-staging', '')}
                                alt={update.fromAccount.name}
                                className="h-8 w-8 flex-shrink-0 rounded-full object-cover"
                                width="32px"
                                height="32px"
                              />
                              <div className=" relative overflow-hidden">
                                <div className="flex items-center justify-between gap-4">
                                  <h2 className="flex-shrink overflow-hidden text-ellipsis whitespace-nowrap text-sm text-gray-900 group-hover:underline">
                                    {update.title}
                                  </h2>
                                  <p className="flex-shrink-0 text-sm text-gray-500">
                                    <FormattedDate dateStyle={'medium'} value={update.createdAt} />
                                  </p>
                                </div>
                                <p className="overflow-hidden text-ellipsis whitespace-nowrap text-sm text-gray-500">
                                  {sanitizeHtml(update.summary, { allowedTags: [], allowedAttributes: {} })}
                                </p>
                              </div>
                            </a>
                          ))}
                        </div>
                      </React.Fragment>
                    )}
                  </AnimateHeight>
                  <div className="mt-4">
                    <a
                      href={`https://opencollective.com/${collective?.slug}`}
                      target="_blank"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-base font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      rel="noreferrer"
                      // onClick={onClose}
                    >
                      Learn more on Open Collective
                    </a>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </React.Fragment>
  );
}
