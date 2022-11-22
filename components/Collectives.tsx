/* eslint-disable react/jsx-key */
import React, { useEffect } from 'react';
import { ChevronLeft } from '@styled-icons/fa-solid/ChevronLeft';
import { ChevronRight } from '@styled-icons/fa-solid/ChevronRight';
import { Sort } from '@styled-icons/fa-solid/Sort';
import { SortDown } from '@styled-icons/fa-solid/SortDown';
import { FormattedDate } from 'react-intl';
import { usePagination, useSortBy, useTable, useFilters } from 'react-table';
import styled from 'styled-components';

import { formatCurrency } from '@opencollective/frontend-components/lib/currency-utils';

import CollectiveModal from './CollectiveModal';

const LocationPin = () => (
  <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.51945 15.1569C9.2455 14.5788 9.97134 13.9255 10.6506 13.2085C12.6317 11.1173 13.8333 8.91439 13.8333 6.66666C13.8333 2.98476 10.8486 0 7.16667 0C3.48477 0 0.5 2.98476 0.5 6.66666C0.5 8.91439 1.7016 11.1173 3.6827 13.2085C4.362 13.9255 5.08783 14.5788 5.81388 15.1569C6.0684 15.3596 6.30522 15.5387 6.51853 15.6928C6.64852 15.7867 6.74324 15.8523 6.79687 15.888C7.0208 16.0373 7.31253 16.0373 7.53647 15.888C7.5901 15.8523 7.68482 15.7867 7.81481 15.6928C8.02812 15.5387 8.26493 15.3596 8.51945 15.1569ZM9.6827 12.2915C9.0495 12.9599 8.36908 13.5722 7.68888 14.1139C7.50322 14.2617 7.32821 14.3957 7.16667 14.5151C7.00513 14.3957 6.83011 14.2617 6.64445 14.1139C5.96425 13.5722 5.28383 12.9599 4.65063 12.2915C2.88173 10.4243 1.83333 8.50225 1.83333 6.66666C1.83333 3.72114 4.22115 1.33333 7.16667 1.33333C10.1122 1.33333 12.5 3.72114 12.5 6.66666C12.5 8.50225 11.4516 10.4243 9.6827 12.2915ZM7.16667 9.33332C5.69391 9.33332 4.5 8.13942 4.5 6.66666C4.5 5.1939 5.69391 3.99999 7.16667 3.99999C8.63943 3.99999 9.83333 5.1939 9.83333 6.66666C9.83333 8.13942 8.63943 9.33332 7.16667 9.33332ZM8.5 6.66666C8.5 7.40304 7.90305 7.99999 7.16667 7.99999C6.43029 7.99999 5.83333 7.40304 5.83333 6.66666C5.83333 5.93028 6.43029 5.33333 7.16667 5.33333C7.90305 5.33333 8.5 5.93028 8.5 6.66666Z"
      fill="#4D4F51"
    />
  </svg>
);

const Table = styled.table`
  padding: 0;
  border-collapse: collapse;
  border-spacing: 0;
  width: 100%;
  thead {
    tr {
      th {
        font-weight: 700;
        color: #374151;
        padding: 16px 8px;
        height: 60px;
        text-transform: uppercase;
        font-size: 12px;
        letter-spacing: 0.06em;
        padding-bottom: 16px;
      }
    }
  }

  .container {
    width: 100%;
  }
  tbody {
    tr {
      cursor: pointer;
      border-top: 1px solid #f1f5f9;

      transition: background 0.1s ease-in-out;
      :hover {
        background: #fbfcfd;
      }
      td {
        padding: 16px;
      }
    }
  }
  .collective {
    display: flex;
    align-items: center;
    grid-gap: 16px;
    color: #333;
    font-weight: 500;
    text-decoration: none;
    max-width: 350px;
    span {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .last {
    padding-right: 20px;
  }
  .first {
    padding-left: 16px;
  }
  .center {
    text-align: center;
  }
  .right {
    text-align: right;
  }
  .left {
    text-align: left;
  }
`;

export const Avatar = styled.img`
  border-radius: 8px;
  object-fit: cover;
  height: 40px;
  width: 40px;
`;

function LocationFilter({ column: { filterValue, setFilter, preFilteredRows, id } }) {
  const options = React.useMemo(() => {
    const regions = [];

    preFilteredRows.forEach(row => {
      if (!regions.includes(row.values.location.region) && row.values.location.region) {
        regions.push(row.values.location.region);
      }
    });

    return regions.map(region => ({ label: region, type: 'region' })).sort((a, b) => a.label.localeCompare(b.label));
  }, [id, preFilteredRows]);

  return (
    <select
      value={filterValue}
      onChange={e => {
        setFilter(e.target.value || undefined);
      }}
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={JSON.stringify(option)}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

function filterLocation(rows, id, filterValue) {
  return rows.filter(row => {
    const filter = JSON.parse(filterValue);
    const { region, isOnline, isGlobal } = row.original.location;
    if (filter.type === 'region') {
      return region === filter.label;
    } else if (filter.type === 'online') {
      return isOnline;
    } else if (filter.type === 'global') {
      return isGlobal;
    }
  });
}

interface Props {
  collectives: [any];
  collectivesData: object;
  currentMetric: string;
  currentTimePeriod: string;
  currentTag: string;
  locale: string;
}

export default function Collectives({
  collectives,
  collectivesData,
  currentMetric,
  currentTimePeriod,
  currentTag,
  locale,
}: Props) {
  const [collectiveInModal, setCollectiveInModal] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const data = React.useMemo(() => collectives, [currentTag, currentTimePeriod]);

  const columns = React.useMemo(
    () => [
      {
        accessor: 'name',
        Cell: ({ row }) => (
          <div className="collective">
            <Avatar alt={row.original.name} src={row.original.imageUrl} height={'40px'} width={'40px'} />
            <span>{row.original.name}</span>
          </div>
        ),
        Header: 'Name',
        sortDescFirst: true,
        disableSortBy: false,
        className: 'left first',
        disableFilters: true,
      },
      {
        accessor: 'location',
        Cell: ({ row }) =>
          row.original.location.label && (
            <div className="flex justify-start">
              <span className="text-sm bg-gray-50 rounded-full py-1 px-2 whitespace-nowrap border flex items-center gap-1">
                <LocationPin />
                {row.original.location.label}
              </span>
            </div>
          ),
        Header: 'Location',
        Filter: LocationFilter,
        filter: filterLocation,
        disableSortBy: true,
        className: 'left',
      },
      {
        Header: 'Created',
        accessor: 'createdAt',
        sortDescFirst: true,
        Cell: ({ row }) => new Date(row.original.createdAt).getUTCFullYear(),
        className: 'center',
        disableFilters: true,
      },
      {
        Header: 'Contributors',
        accessor: 'contributorsCount',
        sortDescFirst: true,
        Cell: tableProps => tableProps.row.original.contributorsCount.toLocaleString(locale),
        className: 'center',
        disableFilters: true,
      },
      {
        Header: '% disbursed',
        accessor: 'percentDisbursed',
        sortDescFirst: true,
        Cell: ({ row }) => {
          const percentDisbursed = parseFloat(row.original.percentDisbursed);
          return isNaN(percentDisbursed) ? 'n/a' : `${percentDisbursed.toFixed(1)}%`;
        },
        className: 'right',
        disableFilters: true,
      },
      {
        Header: 'T. raised',
        accessor: 'totalRaised',
        Cell: tableProps => (
          <div className="">
            {formatCurrency(tableProps.row.original.totalRaised, tableProps.row.original.currency, {
              locale: 'en-US',
              precision: 0,
            })}
          </div>
        ),
        sortDescFirst: true,
        className: 'right last',
        disableFilters: true,
      },
    ],
    [currentTag, currentTimePeriod],
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    toggleSortBy,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    nextPage,
    previousPage,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data,
      disableSortRemove: true,
      initialState: {
        sortBy: [
          {
            id: 'totalRaised',
            desc: true,
          },
        ],
      },
    },
    useFilters,
    useSortBy,
    usePagination,
  );

  useEffect(() => {
    if (currentMetric === 'TOTAL_RAISED') {
      toggleSortBy('totalRaised', true, false);
    }
  }, [currentMetric, currentTimePeriod, currentTag]);

  return (
    <React.Fragment>
      <CollectiveModal isOpen={isModalOpen} collective={collectiveInModal} onClose={() => setIsModalOpen(false)} />
      <Table {...getTableProps()} className="">
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps([{ className: column.className }, column.getSortByToggleProps()])}
                  style={{
                    color: column.isSorted ? 'black' : '#374151',
                    cursor: 'pointer',
                  }}
                >
                  {column.render('Header')}{' '}
                  {column.canSort && (
                    <span
                      style={{
                        display: 'inline-block',
                        verticalAlign: 'top',
                        marginLeft: '4px',
                        opacity: column.isSorted ? '100%' : '25%',
                      }}
                    >
                      {column.isSortedDesc ? (
                        <SortDown size="16" />
                      ) : column.isSorted ? (
                        <SortDown style={{ transform: 'rotate(180deg)' }} size="16" />
                      ) : (
                        <Sort size="16" />
                      )}
                    </span>
                  )}
                  <div>{column.canFilter ? column.render('Filter') : null}</div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr
                key={row.original.id}
                {...row.getRowProps()}
                onClick={() => {
                  setCollectiveInModal(collectivesData[row.original.id]);
                  setIsModalOpen(true);
                }}
              >
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps([{ className: cell.column.className }])}>{cell.render('Cell')}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>
      <div className="px-6 pt-4 pb-4 flex items-center gap-4 text-sm text-gray-700">
        <span>
          Page{' '}
          <input
            type="number"
            className="border rounded w-10 inline-block text-center"
            value={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
          />{' '}
          of {pageOptions.length}
        </span>

        <div>
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className="hover:text-black p-2 hover:bg-gray-100 rounded-full w-10 h-10"
          >
            <ChevronLeft size="12" />
          </button>{' '}
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className="hover:text-black p-2 hover:bg-gray-100 rounded-full w-10 h-10"
          >
            <ChevronRight size="12" />
          </button>
        </div>
      </div>
    </React.Fragment>
  );
}
