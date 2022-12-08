import React from 'react';
import { cva } from 'class-variance-authority';

const CategorySelect = ({ categories, selectedTag, onSelect }) => {
  return (
    <div className="space-y-4">
      {categories.map(category => (
        <button
          type="button"
          key={category.label}
          className={cva(
            [
              `flex w-full items-center justify-between rounded-lg border-2 px-4 py-2 transition-colors hover:bg-[#FFFEFC]`,
            ],
            {
              variants: {
                selected: {
                  true: `border-${category.tc}-500`,
                  false: `border-transparent hover:border-${category.tc}-500`,
                },
              },
            },
          )({ selected: category.tag === selectedTag })}
          onClick={() => {
            onSelect(category);
          }}
        >
          <span className="font-medium text-gray-800">{category.label}</span>{' '}
          <span className="text-sm">{category.collectives.length}</span>
        </button>
      ))}
    </div>
  );
};

export default CategorySelect;
