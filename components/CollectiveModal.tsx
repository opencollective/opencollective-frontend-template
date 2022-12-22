import React, { Fragment } from 'react';
import { gql, useQuery } from '@apollo/client';
import { Dialog, Transition } from '@headlessui/react';
import AnimateHeight from 'react-animate-height';
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
      admins: members(role: [ADMIN], limit: 0) {
        totalCount
      }

      updates(limit: 3, onlyPublishedUpdates: true) {
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

  if (!collective) {
    return null;
  }

  const statsLabelClasses = 'flex items-center text-xs font-bold uppercase text-gray-700 leading-6';
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
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                  <div className="space-y-4 p-6 pb-3 lg:p-8 lg:pb-4">
                    <div className="flex items-center justify-between">
                      <Dialog.Title as="h3" className="flex items-center gap-4 text-xl font-medium text-gray-900">
                        <Avatar src={collective?.imageUrl} height="40px" width="40px" alt={collective?.name} />
                        <span>{collective?.name}</span>
                      </Dialog.Title>
                      <button
                        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border text-gray-600 hover:bg-gray-50 lg:h-12 lg:w-12"
                        onClick={onClose}
                      >
                        <CloseIcon className="" />
                      </button>
                    </div>

                    {(collective.tags?.length > 0 || collective.location?.label) && (
                      <div className="flex flex-wrap gap-2">
                        {collective.location && (
                          <LocationTag
                            setLocationFilter={filter => {
                              setFilter({ location: filter });
                              onClose();
                            }}
                            location={collective.location}
                          />
                        )}
                        {collective?.tags?.map(tag => (
                          <button
                            key={tag}
                            className="rounded-full bg-gray-100 px-2 py-1 text-sm text-gray-700"
                            onClick={() => {
                              setFilter({ tag });
                              onClose();
                            }}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    )}
                    <p className="text-sm text-gray-500">
                      Fiscal Host:{' '}
                      <a
                        className="text-black hover:text-blue-600"
                        href={`https://opencollective.com/${collective.host.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {collective.host.name}
                      </a>
                    </p>
                    <AnimateHeight id="description" duration={500} height={data?.account ? 'auto' : 0}>
                      <p className="text-base text-gray-500">{data?.account?.description}</p>
                    </AnimateHeight>
                    <div className="font-regular grid grid-cols-2 gap-2 rounded-lg bg-gray-50 px-5 py-4 text-gray-700">
                      <div className={statsLabelClasses}>Raised</div>
                      <div>
                        {formatCurrency(collective.stats?.ALL.raised ?? 0, currency, {
                          locale,
                          precision: 0,
                        })}
                      </div>
                      <div className={statsLabelClasses}>Contributors</div>{' '}
                      <div>{(collective.stats?.ALL.contributors ?? 0).toLocaleString(locale)}</div>
                      <div className={statsLabelClasses}>Disbursed</div>
                      <div>
                        {formatCurrency(Math.abs(collective.stats?.ALL.spent ?? 0), currency, {
                          locale,
                          precision: 0,
                        })}
                      </div>
                      <div className={statsLabelClasses}>Collective admins</div>
                      <div>{data?.account?.admins.totalCount}</div>
                      <div className={statsLabelClasses}>Created</div>
                      <div>
                        {data?.account?.createdAt && (
                          <FormattedDate dateStyle={'medium'} value={data.account.createdAt} />
                        )}
                      </div>
                    </div>

                    <AnimateHeight id="updates" duration={500} height={data?.account ? 'auto' : 0}>
                      {data?.account?.updates?.nodes?.length > 0 && (
                        <div>
                          <h4 className="mb-1 text-base text-gray-800">Updates</h4>
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
                        </div>
                      )}
                    </AnimateHeight>
                  </div>
                  <div className="flex justify-center gap-4 border-t px-8 py-5">
                    <a
                      href={`https://opencollective.com/${collective?.slug}/contribute`}
                      target="_blank"
                      className="inline-flex justify-center rounded-full border border-transparent bg-[#1761EB] px-4 py-[10px] text-sm font-medium text-white transition-colors hover:bg-[#1659E1] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 active:bg-[#1153D6]"
                      rel="noreferrer"
                    >
                      Contribute
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
