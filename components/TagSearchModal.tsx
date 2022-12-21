import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';

import { CloseIcon } from './Icons';

const TagSearch = ({ color, options, currentTag, setTagFilter, handleClose, locale }) => {
  const tagWhenOpened = React.useMemo(() => currentTag, []);
  const [query, setQuery] = useState(currentTag ?? '');
  const filteredOptions =
    query === ''
      ? options
      : options.filter(option =>
          option.tag.toLowerCase().replace(/\s+/g, '').includes(query.toLowerCase().replace(/\s+/g, '')),
        );

  const showCloseButton = currentTag === tagWhenOpened;
  return (
    <div className="relative z-50 ">
      <div className="flex items-center justify-between ">
        <input
          className={`z-20 flex w-full items-center justify-between rounded-lg border-2 border-transparent py-2 text-lg text-gray-800 transition-colors	focus:outline-none`}
          placeholder={'Search additional tags...'}
          onChange={event => setQuery(event.target.value)}
          defaultValue={currentTag}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
        />
        <button
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border text-gray-600 hover:bg-gray-50"
          onClick={handleClose}
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-4 space-y-2">
        {filteredOptions.length === 0 && query !== '' ? (
          <div className="relative cursor-default select-none border-2 border-transparent py-2 text-gray-500">
            Nothing found.
          </div>
        ) : (
          filteredOptions.slice(0, 10).map(option => (
            <button
              key={option.tag}
              className={`group relative flex w-full cursor-pointer select-none items-center justify-between rounded-lg border-2 bg-gray-50 py-2 px-4 font-medium text-gray-800 hover:bg-gray-100 ${
                currentTag === option.tag ? `border-${color}-500` : `border-transparent`
              }`}
              onClick={() => {
                setTagFilter(option.tag);
                handleClose();
              }}
            >
              <span className={'block truncate'}>{option.tag}</span>
              <div className="relative h-full">
                <div
                  className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity ${
                    showCloseButton && currentTag === option.tag
                      ? ' opacity-0 group-hover:opacity-100 group-focus:opacity-100'
                      : 'opacity-0'
                  }`}
                >
                  <CloseIcon className={` h-4 w-4 `} />
                </div>
                <span
                  className={`text-sm font-normal transition-opacity ${
                    showCloseButton && currentTag === option.tag
                      ? 'opacity-100  group-hover:opacity-0 group-focus:opacity-0'
                      : ''
                  }`}
                >
                  {option.count.toLocaleString(locale)}
                </span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export const TagSearchModal = ({ open, handleClose, options, setTagFilter, currentCategory, locale }) => {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-30" onClose={handleClose}>
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

        <div className="fixed top-0 right-0 left-0 overflow-y-auto lg:top-20">
          <div className="flex min-h-full items-center justify-center overflow-y-scroll p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="h-full w-full max-w-sm transform overflow-y-scroll rounded-2xl bg-white py-6 px-8 text-left align-top shadow-xl transition-all">
                <TagSearch
                  options={options}
                  setTagFilter={setTagFilter}
                  currentTag={currentCategory?.tag}
                  color={currentCategory?.color?.name}
                  handleClose={handleClose}
                  locale={locale}
                />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
