/* eslint-disable react/jsx-key */
import React, { useEffect } from 'react';
import { Sort } from '@styled-icons/fa-solid/Sort';
import { SortDown } from '@styled-icons/fa-solid/SortDown';
import { FormattedDate } from 'react-intl';
import { useSortBy, useTable, usePagination } from 'react-table';
import styled from 'styled-components';
import { ChevronRight } from '@styled-icons/fa-solid/ChevronRight';
import { ChevronLeft } from '@styled-icons/fa-solid/ChevronLeft';

import { formatCurrency } from '@opencollective/frontend-components/lib/currency-utils';

import CollectiveModal from './CollectiveModal';

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
        // Header: () => (
        //   <H4 px={''} fontWeight="500" mt={0} mb={0}>
        //     {data.length.toLocaleString(locale)} collectives
        //   </H4>
        // ),
        sortDescFirst: true,

        disableSortBy: false,
        className: 'left first',
      },
      // {
      //   Header: 'Description',
      //   accessor: 'description',
      // },
      {
        Header: 'Created',
        accessor: 'createdAt',
        sortDescFirst: true,
        Cell: ({ row }) => <FormattedDate dateStyle={'medium'} value={row.original.createdAt} />,
        className: 'center',
      },
      {
        Header: 'Contributors',
        accessor: 'contributorsCount',
        sortDescFirst: true,
        Cell: tableProps => tableProps.row.original.contributorsCount.toLocaleString(locale),
        className: 'center',
      },
      {
        Header: 'Admins',
        accessor: 'adminCount',
        sortDescFirst: true,
        // Cell: tableProps => tableProps.row.original.expensesCount.toLocaleString(locale),
        className: 'center',
      },
      {
        Header: 'Expenses',
        accessor: 'expensesCount',
        sortDescFirst: true,
        Cell: tableProps => tableProps.row.original.expensesCount.toLocaleString(locale),
        className: 'center',
      },
      {
        Header: 'T. disbursed',
        accessor: 'totalDisbursed',
        sortDescFirst: true,
        Cell: tableProps =>
          formatCurrency(tableProps.row.original.totalDisbursed, tableProps.row.original.currency, {
            locale: 'en-US',
            precision: 0,
          }),
        className: 'right',
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
      },
    ],
    [currentTag, currentTimePeriod],
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    toggleSortBy,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
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
                  {column.render('Header')}
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
