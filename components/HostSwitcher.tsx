// TODO: fix these
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import React, { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Link from 'next/link';

const ChevronUpDown = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
  </svg>
);

export default function HostSwitcher({ host, hosts }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeHost, setActiveHost] = useState(host);

  useEffect(() => {
    setActiveHost(host);
  }, [host]);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <Fragment>
      <a
        // This is a link since it needs to break with the text, TODO: fix suggestion
        onClick={openModal}
        className={`cursor-pointer underline underline-offset-4 transition-colors ${host.styles.text}`}
      >
        {host.name}
        <ChevronUpDown className="inline h-6 w-6 flex-shrink-0 text-gray-800 lg:h-12 lg:w-12" />
      </a>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-30" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
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
                <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-4 text-left align-middle shadow-xl transition-all lg:p-8">
                  <Dialog.Title as="h3" className="mb-4 text-xl font-bold leading-6 text-gray-900">
                    Switch context
                  </Dialog.Title>
                  <div className="grid grid-cols-2 gap-4 lg:gap-6">
                    {[
                      {
                        name: 'All hosts',
                        slug: '',
                        color: 'blue',
                        logoSrc: '/oc-logo.svg',
                        styles: { box: 'bg-[#F5FAFF] text-[#0C2D66]' },
                      },
                      ...hosts.filter(h => h.slug.length),
                    ].map(host => (
                      <Link href={`/${host.slug}`} key={host.slug}>
                        <a
                          key={host.slug}
                          className={`relative flex h-60 flex-col items-center justify-center gap-3 rounded-xl border-3  p-4 text-center focus:outline-none lg:gap-4 lg:p-6  focus:border-${
                            host.color
                          }-500 ${host.styles.box} transition-colors ${
                            activeHost.slug === host.slug
                              ? `border-${host.color}-500`
                              : `border-transparent hover:border-${host.color}-500`
                          }`}
                          onClick={() => {
                            closeModal();
                          }}
                        >
                          <span className={`text-base font-medium lg:text-lg `}>{host.name}</span>

                          <div className="flex min-w-[64px] justify-center lg:min-w-[128px]">
                            <img src={host.logoSrc} className="h-5 lg:h-10" alt={host.name} />
                          </div>
                        </a>
                      </Link>
                    ))}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </Fragment>
  );
}
