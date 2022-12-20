import React from 'react';
import { ChevronDown } from '@styled-icons/fa-solid/ChevronDown';

const findOptionFromValue = (options, value) => {
  return options.find(option => {
    if (!value) {
      return option.value === '';
    }

    return option.value === value;
  });
};

export default function DropdownSelector({
  options,
  fieldLabel,
  value,
  onChange,
  currentCategoryColor,
  ariaLabel,
}: {
  options: any;
  fieldLabel: any;
  value: any;
  currentCategoryColor: string;
  ariaLabel: string;
  onChange: (any) => void;
  onOpen?: () => void;
}) {
  const selectedOption = findOptionFromValue(options, value);
  const breakIndex = options.findIndex(option => option.break);
  const lastVisibleIndex = breakIndex > 0 ? breakIndex : options.length;
  const filterApplied = selectedOption.value !== options[0].value;

  return (
    <div className="group relative h-10 w-full">
      <label className="pointer-events-none absolute inset-0 z-10 flex items-center justify-between gap-2 py-2 px-3 text-gray-800">
        {fieldLabel}
        <div className="flex items-center gap-1 overflow-hidden whitespace-nowrap text-sm">
          <span className="overflow-hidden overflow-ellipsis">{selectedOption?.label}</span> <ChevronDown size="10" />
        </div>
      </label>
      <select
        aria-label={ariaLabel}
        className={`absolute inset-0 flex w-full  items-center justify-end rounded-lg border-2 bg-opacity-75 text-transparent transition-colors   ${
          filterApplied
            ? `bg-${currentCategoryColor}-50 border-transparent hover:bg-opacity-100 hover:border-${currentCategoryColor}-100`
            : 'border-transparent bg-white hover:border-gray-100  hover:bg-gray-50 '
        }`}
        value={value}
        onChange={e => {
          const { value } = e.target;
          const option = findOptionFromValue(options, value);
          onChange(option);
        }}
      >
        {options.slice(0, lastVisibleIndex).map(option => {
          if (option.hr === true) {
            return (
              <option disabled={true} key="hr">
                ----
              </option>
            );
          }
          return (
            <option key={option.value} value={option.value}>
              {option.type === 'country' ? ' - ' : ''}
              {option.label}
              {option.count && `  (${option.count})`}
            </option>
          );
        })}
      </select>
    </div>
  );
}
