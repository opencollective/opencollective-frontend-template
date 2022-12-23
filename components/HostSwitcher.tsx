import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useRouter } from 'next/router';

import { ChevronUpDown, CloseIcon } from './Icons';

export default function HostSwitcher({ host, hosts, locale }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }
  const hostNameStyles = `relative underline tracking-tight decoration-3 underline-offset-3 transition-colors lg:decoration-4 lg:underline-offset-4 ${host.styles.text}`;

  return (
    <Fragment>
      <label htmlFor="host-switcher" className="group cursor-pointer">
        {/* Split host name so that we can put switcher chevron in a no-wrap span with the last word, keeping it on the same line */}
        {host.name.split(' ').map((word: string, i, arr) => {
          const lastWord = i === arr.length - 1;
          return (
            <Fragment key={word}>
              <span className={`${hostNameStyles} whitespace-nowrap`}>{word}</span>

              {lastWord && (
                <React.Fragment>
                  {host.root && <span className={`relative -top-2 -mx-0.5 -mr-1 select-none text-gray-400`}>*</span>}
                  <button id="host-switcher" onClick={openModal}>
                    <ChevronUpDown
                      className={`-my-0.5 -ml-0.5 -mr-1 inline h-7 w-7 flex-shrink-0 opacity-75 transition-opacity group-hover:opacity-100 lg:-ml-1 lg:-mr-2 lg:h-12 lg:w-12 lg:opacity-50 ${
                        host.styles.text
                      } ${host.root ? 'xl:mr-3' : ''}`} // Hack to push the next word to the next line on xl screens on the root
                    />
                  </button>
                </React.Fragment>
              )}
              <span className={!lastWord ? hostNameStyles : ''}> </span>
            </Fragment>
          );
        })}
      </label>

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
                  <Dialog.Title as="h3" className="mb-4 mt-2 text-2xl font-bold leading-6 text-gray-900 lg:mb-8">
                    Select host
                  </Dialog.Title>
                  <button
                    className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border text-gray-600 hover:bg-gray-50 lg:right-8 lg:top-6 lg:h-12 lg:w-12"
                    onClick={closeModal}
                  >
                    <CloseIcon className="" />
                  </button>
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
                    {hosts.map(host => (
                      <button
                        key={host.slug ?? 'root'}
                        className={`flex flex-col items-center justify-center gap-3 rounded-xl border-3 p-6 text-center lg:h-60 lg:gap-6 ${host.styles.box} border-transparent transition-colors`}
                        onClick={() => {
                          router.push(`/${host.slug ?? ''}`);
                          closeModal();
                        }}
                      >
                        <span className={`text-base font-bold lg:text-xl ${host.styles.text}`}>
                          {host.root ? 'Selected hosts on' : host.name}
                        </span>
                        <img src={host.logoSrc} className="h-6 lg:h-10" alt={host.name} />
                        <div>
                          <p className="underline">{host.count.toLocaleString(locale)} collectives</p>
                          {/* {host.root && (
                            <p className="text-sm">out of {platformTotalCollectives.toLocaleString(locale)} in total</p>
                          )} */}
                        </div>
                      </button>
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
