import React, { Fragment, useEffect, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { Dialog, Transition } from '@headlessui/react';
import { Xmark } from '@styled-icons/fa-solid/Xmark';
import AnimateHeight, { Height } from 'react-animate-height';
import { FormattedDate } from 'react-intl';
import sanitizeHtml from 'sanitize-html';

import { formatCurrency } from '@opencollective/frontend-components/lib/currency-utils';

import { Avatar } from './Collectives';

export const collectiveQuery = gql`
  query Account($slug: String!) {
    account(slug: $slug) {
      id
      slug
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
export default function CollectiveModal({ isOpen, onClose, collective, locale = 'en' }) {
  const { data } = useQuery(collectiveQuery, {
    variables: { slug: collective?.slug },
    skip: !collective,
  });
  const [height, setHeight] = useState<Height>(0);

  useEffect(() => {
    if (data?.account?.updates?.nodes.length > 0) {
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
        <Dialog as="div" className="relative z-10" onClose={onClose}>
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
                  <Dialog.Title as="h3" className="text-xl font-medium text-gray-900 flex items-center gap-4">
                    <Avatar src={collective?.imageUrl} height="40px" width="40px" alt={collective?.name} />
                    <span>{collective?.name}</span>
                  </Dialog.Title>
                  <button
                    className="absolute right-2 top-2 w-10 h-10 rounded-full hover:bg-gray-50 text-gray-600"
                    onClick={onClose}
                  >
                    <Xmark size={22} />
                  </button>
                  <div className="mt-3">
                    <p className="text-base text-gray-500">{collective?.description}</p>
                  </div>
                  {collective.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {collective?.tags?.map(tag => (
                        <span key={tag} className="bg-gray-100 rounded-full px-2 py-1 text-sm text-gray-700">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-4 gap-1 text-gray-600 text-sm mt-4 bg-gray-50 p-4 rounded">
                    <div className="text-black">Total disbursed</div>
                    <div>
                      {formatCurrency(collective.totalDisbursed, collective.currency, {
                        locale,
                        precision: 0,
                      })}
                    </div>
                    <div className="text-black">Total raised</div>
                    <div>
                      {formatCurrency(collective.totalRaised, collective.currency, {
                        locale,
                        precision: 0,
                      })}
                    </div>
                    <div className="text-black">Expenses</div>{' '}
                    <div>{collective.expensesCount.toLocaleString(locale)}</div>
                    <div className="text-black">Admins</div> <div>{collective.adminCount.toLocaleString(locale)}</div>
                    <div className="text-black">Contributors</div>{' '}
                    <div>{collective.contributorsCount.toLocaleString(locale)}</div>
                    <div className="text-black">Created</div>
                    <div>
                      <FormattedDate dateStyle={'medium'} value={collective.createdAt} />
                    </div>
                  </div>
                  <AnimateHeight id="updates" duration={500} height={height}>
                    {data?.account?.updates?.nodes?.length > 0 && (
                      <React.Fragment>
                        <h4 className="text-sm text-gray-500 mt-4 mb-1">Latest updates</h4>
                        <div className="flex flex-col gap-2">
                          {data.account?.updates?.nodes?.map(update => (
                            <a
                              key={update.slug}
                              href={`https://opencollective.com/${collective.slug}/updates/${update.slug}`}
                              className="flex items-center gap-3 hover:bg-gray-50 rounded-md p-2 transition-colors duration-100"
                              target="_blank"
                              rel="noreferrer"
                            >
                              <img
                                src={update.fromAccount.imageUrl.replace('-staging', '')}
                                alt={update.fromAccount.name}
                                className="rounded-full h-8 w-8 object-cover flex-shrink-0"
                                width="32px"
                                height="32px"
                              />
                              <div className=" overflow-hidden relative">
                                <div className="flex items-center justify-between gap-4">
                                  <h2 className="text-sm text-gray-900 text-ellipsis overflow-hidden whitespace-nowrap flex-shrink group-hover:underline">
                                    {update.title}
                                  </h2>
                                  <p className="text-sm text-gray-500 flex-shrink-0">
                                    <FormattedDate dateStyle={'medium'} value={update.createdAt} />
                                  </p>
                                </div>
                                <p className="text-sm text-gray-500 text-ellipsis overflow-hidden whitespace-nowrap">
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
                      className="w-full inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-base font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
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
