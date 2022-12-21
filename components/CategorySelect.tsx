import React, { Fragment, useState } from 'react';
import { cva } from 'class-variance-authority';

import { TagSearchModal } from './TagSearchModal';

const CategoryButton = ({ label, count, color, active, onClick }) => {
  return (
    <button
      type="button"
      className={cva(
        [
          `flex w-full items-center justify-between rounded-lg border-2 px-4 py-2 transition-colors hover:bg-${color}-50 hover:bg-opacity-50	${
            label === 'More...' ? 'text-gray-400' : 'text-gray-800'
          }`,
        ],
        {
          variants: {
            active: {
              true: `border-${color}-500`,
              false: `border-transparent hover:border-${color}-500`,
            },
          },
        },
      )({ active })}
      onClick={onClick}
    >
      <span className={`font-medium `}>{label}</span>
      {label !== 'More...' && <span className="text-sm">{count}</span>}
    </button>
  );
};

const CategorySelect = ({ categories, selectedTag, setTagFilter, locale }) => {
  const [tagSearchModalOpen, setTagSearchModalOpen] = useState(false);

  function closeTagSearch() {
    setTagSearchModalOpen(false);
  }

  function openTagSearch() {
    setTagSearchModalOpen(true);
  }
  const optionsCategory = categories.find(cat => cat.options);
  return (
    <Fragment>
      <div className="py-2 first-letter:space-y-2 lg:space-y-3">
        {categories.map(category => {
          return (
            <CategoryButton
              key={category.label}
              label={category.label}
              count={category.count?.toLocaleString(locale)}
              color={category.color.name}
              active={selectedTag === category.tag}
              onClick={() => (!category.options ? setTagFilter(category.tag) : openTagSearch())}
            />
          );
        })}
      </div>
      <TagSearchModal
        open={tagSearchModalOpen}
        handleClose={closeTagSearch}
        currentCategory={optionsCategory.tag === selectedTag ? optionsCategory : null}
        options={optionsCategory.options}
        locale={locale}
        setTagFilter={setTagFilter}
      />
    </Fragment>
  );
};

export default CategorySelect;
