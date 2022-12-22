import React from 'react';
import { ChevronLeft } from '@styled-icons/fa-solid/ChevronLeft';
import { ChevronRight } from '@styled-icons/fa-solid/ChevronRight';

export function PaginationControls({
  pageIndex,
  nextPage,
  previousPage,
  canNextPage,
  canPreviousPage,
  pageLength,
  gotoPage,
}: {
  pageIndex: number;
  nextPage: () => void;
  previousPage: () => void;
  canNextPage: boolean;
  canPreviousPage: boolean;
  pageLength: number;
  gotoPage?: (number) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-4 px-10 text-sm text-gray-700">
      <span>
        <label htmlFor="page-number">Page</label>{' '}
        {gotoPage ? (
          <input
            type="number"
            id="page-number"
            className="inline-block w-10 rounded border text-center"
            value={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
          />
        ) : (
          <span className="">{pageIndex + 1}</span>
        )}{' '}
        of {pageLength}
      </span>

      <div>
        <button
          aria-label="Previous page"
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
          className="h-10 w-10 rounded-full p-2 hover:bg-gray-100 hover:text-black"
        >
          <ChevronLeft size="12" />
        </button>{' '}
        <button
          aria-label="Next page"
          onClick={() => nextPage()}
          disabled={!canNextPage}
          className="h-10 w-10 rounded-full p-2 hover:bg-gray-100 hover:text-black"
        >
          <ChevronRight size="12" />
        </button>
      </div>
    </div>
  );
}
