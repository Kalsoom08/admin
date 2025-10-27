import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import {
  EMPLOYEES_ROLE_COLOR,
  EMPLOYEES_STATUS_COLOR,
  EMPLOYEES_STATUS,
  MONTH_ITEM_COLOR,
  MONTH_ITEM
} from '@data/Constants';
import { cn } from '@maincomponents/lib/utils';
import { Button } from '@maincomponents/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@maincomponents/components/ui/table';
import { Input } from '@maincomponents/components/ui/input';
import { Badge } from '@maincomponents/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@maincomponents/components/ui/dropdown-menu';
import { Ellipsis, PenLine, Trash, ArrowUp, ArrowDown, NotepadText } from 'lucide-react';
import AddButton from '@maincomponents/Buttons/AddButton';
import TableSkeleton from '@maincomponents/loaders/TableSkeleton';
import FilterSelect from '@maincomponents/Inputs/FilterSelect';
import TablePagination from '@maincomponents/Pagination';
import SmCard from '@maincomponents/Cards/SmCard';
import DeletePayroll from '@maincomponents/modal/DeletePayRoll';
import AddEditPayRoll from '@maincomponents/modal/AddEditPayRoll';
import { fetchAllPayRoll, setPage, setPerPage, setSelectedPayRoll, setFilters } from '@redux/slice/payrollSlice';

const columnHelper = createColumnHelper();

const PayRoll = () => {
  let once = true;
  const dispatch = useDispatch();
  const { data, listLoading, totalRows, page, perPage, totalPages, filters } = useSelector(state => state.payroll);

  const [open, setOpen] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState([]);
  const [monthFilter, setMonthFilter] = useState([]); // Ensure monthFilter is an array
  const printRef = useRef();
  console.log('monthFilter', monthFilter);

  const columns = useMemo(
    () => [
      columnHelper.accessor('salaryId', { header: 'Salary ID', cell: ({ row }) => row.original.salaryId }),
      columnHelper.accessor('user.fullName', {
        header: 'Employee Name',
        cell: ({ row }) => row.original.user?.fullName || '—'
      }),
      columnHelper.accessor('user.role', {
        header: 'Role',
        cell: ({ row }) => (
          <Badge variant='outline' className={cn('capitalize', EMPLOYEES_ROLE_COLOR.get(row.original.user?.role))}>
            {row.original.user?.role || 'N/A'}
          </Badge>
        )
      }),
      columnHelper.accessor('paidAmount', { header: 'Paid Salary', cell: ({ row }) => row.original.paidAmount }),
      columnHelper.accessor('month', {
        header: 'Month',
        cell: ({ row }) => (
          <Badge variant='outline' className={cn('capitalize', MONTH_ITEM_COLOR.get(MONTH_ITEM[row.original.month]))}>
            {MONTH_ITEM[row.original.month] || 'Unknown'}
          </Badge>
        )
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => (
          <Badge variant='outline' className={cn('capitalize', EMPLOYEES_STATUS_COLOR.get(row.original.status))}>
            {row.original.status}
          </Badge>
        )
      }),
      columnHelper.accessor('comment', { header: 'Comment', cell: ({ row }) => row.original.comment || '—' }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0'>
                <Ellipsis className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-[160px]'>
              <DropdownMenuItem
                onClick={() => {
                  dispatch(setSelectedPayRoll(row.original));
                  setEdit(true);
                  setOpen(true);
                }}
              >
                Edit{' '}
                <DropdownMenuShortcut>
                  <PenLine size={16} />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  dispatch(setSelectedPayRoll(row.original));
                  setDeleteModal(true);
                }}
                className='text-red-500'
              >
                Delete{' '}
                <DropdownMenuShortcut>
                  <Trash size={16} />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      })
    ],
    [dispatch]
  );

  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });

  const handlePageChange = pageNo => dispatch(setPage(pageNo));
  const handleLimitChange = limit => {
    dispatch(setPerPage(Number(limit)));
    dispatch(setPage(1)); // Reset to the first page when changing limit
  };

  useEffect(() => {
    if (once) {
      once = false;
      dispatch(
        fetchAllPayRoll({
          page,
          limit: perPage,
          search: searchTerm,
          status: statusFilter,
          month: monthFilter.length ? monthFilter : undefined // Pass the filter only if it has values
        })
      );
    }
  }, [dispatch, page, perPage, searchTerm, statusFilter, monthFilter]);

  const handleSearchChange = value => {
    setSearchTerm(value);
    dispatch(setFilters({ ...filters, search: value }));
    dispatch(setPage(1)); // Reset page on search change
  };

  const totalSalary = data.reduce((acc, item) => acc + Number(item.paidAmount || 0), 0);
  const highestSalary = Math.max(...data.map(item => Number(item.paidAmount || 0)), 0);
  const lowestSalary = Math.min(...data.map(item => Number(item.paidAmount || 0)), 0);

  const smCardsData = [
    {
      name: 'Total Monthly Salary',
      totalPrice: totalSalary.toLocaleString(),
      btnIcon: <NotepadText size={15} />,
      iconColor: 'bg-[#DCFCE7]',
      textColor: 'text-[#16A34A]'
    },
    {
      name: 'Highest Salary',
      totalPrice: highestSalary.toLocaleString(),
      btnIcon: <ArrowUp size={15} />,
      iconColor: 'bg-[#DCFCE7]',
      textColor: 'text-[#16A34A]'
    },
    {
      name: 'Lowest Salary',
      totalPrice: lowestSalary.toLocaleString(),
      btnIcon: <ArrowDown size={15} />,
      iconColor: 'bg-[#DCFCE7]',
      textColor: 'text-[#16A34A]'
    }
  ];

  return (
    <>
      <div className='mb-2 flex flex-wrap items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold'>Payroll Management</h2>
          <p className='text-muted-foreground'>Analyze and manage employee salaries</p>
        </div>
        <AddButton
          onClick={() => {
            setEdit(false);
            setOpen(true);
          }}
          text='Add Payroll'
        />
      </div>

      <div className='py-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {listLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className='animate-pulse bg-gray-200 h-20 w-full rounded-md'></div>
            ))
          : smCardsData.map((card, i) => <SmCard key={i} {...card} />)}
      </div>

      <div className='flex items-center mb-4 gap-3'>
        <Input
          placeholder='Search by employee name'
          value={searchTerm}
          onChange={e => handleSearchChange(e.target.value)}
          className='h-8 w-[300px]'
        />
        <FilterSelect
          label='Status'
          value={statusFilter}
          setValue={setStatusFilter}
          options={Object.values(EMPLOYEES_STATUS).map(val => ({ label: val, value: val }))}
        />
        <FilterSelect
          label='Month'
          value={monthFilter}
          setValue={setMonthFilter}
          options={Object.entries(MONTH_ITEM).map(([key, value]) => ({
            label: value, // Display the month name (e.g., 'JANUARY')
            value: key // Store the key (e.g., '1') for filtering
          }))}
        />
      </div>

      <div className='overflow-hidden rounded-md border' ref={printRef}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(hg => (
              <TableRow key={hg.id}>
                {hg.headers.map(h => (
                  <TableHead key={h.id}>{flexRender(h.column.columnDef.header, h.getContext())}</TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {listLoading ? (
              <TableSkeleton columnsCount={columns.length} />
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='text-center h-24'>
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <TablePagination
        totalRecords={totalRows}
        totalPages={totalPages}
        limit={perPage}
        currentPage={page}
        onLimitChange={handleLimitChange}
        onPageChange={handlePageChange}
      />

      {open && (
        <AddEditPayRoll
          isEdit={isEdit}
          open={open}
          onClose={() => {
            dispatch(setSelectedPayRoll(null));
            setOpen(false);
            setEdit(false);
          }}
        />
      )}
      {deleteModal && (
        <DeletePayroll
          open={deleteModal}
          onClose={() => {
            dispatch(setSelectedPayRoll(null));
            setDeleteModal(false);
          }}
        />
      )}
    </>
  );
};

export default PayRoll;
