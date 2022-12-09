import React from 'react';
import { Listbox } from '@headlessui/react';
import { Check } from '@styled-icons/fa-solid/Check';
import { ChevronDown } from '@styled-icons/fa-solid/ChevronDown';

export default function DropdownSelector({
  options,
  fieldLabel,
  value,
  onChange,
  onOpen,
}: {
  options: any;
  fieldLabel: any;
  value: any;
  onChange: (any) => void;
  onOpen?: () => void;
}) {
  const selectedOption = options.find(option => {
    if (!value) {
      return option.value === '';
    }
    if (value.type) {
      return option.value === value.value && option.type === value.type;
    }
    return option.value === value;
  });
  const breakIndex = options.findIndex(option => option.break);
  const lastVisibleIndex = breakIndex > 0 ? breakIndex : options.length;

  return (
    <div className="relative w-full">
      <Listbox value={selectedOption} onChange={onChange}>
        <Listbox.Button
          className="flex w-full items-center justify-between rounded-full p-2 transition-colors hover:bg-gray-50"
          onClick={onOpen}
        >
          {fieldLabel}
          <div className="flex items-center gap-1 whitespace-nowrap text-xs text-gray-800">
            <span>{selectedOption?.label}</span> <ChevronDown size="10" />
          </div>
        </Listbox.Button>
        <Listbox.Options className="absolute right-0 z-10 mt-2 mb-10 w-full overflow-y-scroll rounded-lg bg-white p-2 shadow">
          {options.slice(0, lastVisibleIndex).map(option => {
            if (option.hr === true) {
              return <hr key="hr" className="my-2 border-t border-gray-200" />;
            }
            return (
              <Listbox.Option
                key={option.value}
                value={option}
                className={({ active }) =>
                  `cursor-pointer select-none rounded-lg px-2 py-1 ${active ? 'bg-gray-50 ' : ''}`
                }
              >
                {({ selected }) => (
                  <span className="relative flex items-center justify-between pl-5">
                    {selected ? (
                      <span className="absolute left-0 ">
                        <Check size="12" aria-hidden="true" />
                      </span>
                    ) : null}

                    <span className={option.type === 'country' ? 'pl-3' : ''}>{option.label}</span>
                    {option.count && <span className="text-sm text-gray-500">{option.count}</span>}
                  </span>
                )}
              </Listbox.Option>
            );
          })}
        </Listbox.Options>
      </Listbox>
    </div>
  );
}
