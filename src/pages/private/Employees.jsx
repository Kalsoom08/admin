import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@maincomponents/components/ui/table';
import { Badge } from '@maincomponents/components/ui/badge';
import { cn } from '@maincomponents/lib/utils';
import { Button } from '@maincomponents/components/ui/button';
import { Ellipsis, PenLine, Trash, NotepadText, ArrowUp, ArrowDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut
} from '@maincomponents/components/ui/dropdown-menu';
import AddEditEmployee from '@maincomponents/modal/AddEditEmployee';
import DeleteEmployee from '@maincomponents/modal/DeleteEmployee';
import TablePagination from '@maincomponents/Pagination';
import AddButton from '@maincomponents/Buttons/AddButton';
import { Input } from '@maincomponents/components/ui/input';
import FilterSelect from '@maincomponents/Inputs/FilterSelect';
import SmCard from '@maincomponents/Cards/SmCard';
import TableSkeleton from '@maincomponents/loaders/TableSkeleton';

import {
  fetchAllEmployee,
  fetchEmployeeStats,
  setPage,
  setPerPage,
  setSelectedEmployee
} from '@redux/slice/employeeSlice';
import { EMPLOYEES_ROLE, EMPLOYEES_ROLE_COLOR, EMPLOYEESS_STATUS, EMPLOYEES_STATUS_COLOR } from '@data/Constants';

const columnHelper = createColumnHelper();
const SmCardSkeleton = () => <div className='animate-pulse bg-gray-200 h-20 w-full rounded-md'></div>;

const Employees = () => {
  const dispatch = useDispatch();
  const { data, listLoading, totalRows, page, perPage, totalPages, stats, statsLoading } = useSelector(
    state => state.employee
  );

  const [open, setOpen] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState([]);
  const [roleFilter, setRoleFilter] = useState([]);

  const printRef = useRef();

  const columns = useMemo(
    () => [
      columnHelper.accessor('userId', { header: 'Employee ID', cell: ({ row }) => <div className='w-fit pl-1'>{row.original.userId}</div> }),
      columnHelper.accessor('fullName', { header: 'Full Name', cell: ({ row }) => <div className='w-fit'>{row.original.fullName}</div> }),
      columnHelper.accessor('role', {
        header: 'Role',
        cell: ({ row }) => <Badge variant='outline' className={cn('capitalize', EMPLOYEES_ROLE_COLOR.get(row.original.role))}>{row.original.role}</Badge>
      }),
      columnHelper.accessor('phone', { header: 'Phone Number', cell: ({ row }) => row.original.phone }),
      columnHelper.accessor('salary', { header: 'Salary Amount', cell: ({ row }) => row.original.salary }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => <Badge variant='outline' className={cn('capitalize', EMPLOYEES_STATUS_COLOR.get(row.original.status))}>{row.original.status}</Badge>
      }),
      columnHelper.accessor('joinedDate', {
        header: 'Joined Date',
        cell: ({ row }) => row.original.joinedDate
          ? new Date(row.original.joinedDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
          : '-'
      }),
      columnHelper.accessor('resignDate', {
        header: 'Resign Date',
        cell: ({ row }) => row.original.resignDate
          ? new Date(row.original.resignDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
          : '-'
      }),
      columnHelper.accessor('actions', {
        header: 'Actions',
        cell: ({ row }) => (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='flex h-8 w-8 p-0'><Ellipsis className='h-4 w-4' /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-[160px]'>
              <DropdownMenuItem onClick={() => { dispatch(setSelectedEmployee(row.original)); setEdit(true); setOpen(true); }}>
                Edit <DropdownMenuShortcut><PenLine size={16} /></DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => { dispatch(setSelectedEmployee(row.original)); setDeleteModal(true); }} className='text-red-500!'>
                Delete <DropdownMenuShortcut><Trash size={16} /></DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      })
    ], [dispatch]
  );

  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });

  const handlePageChange = pageNo => dispatch(setPage(pageNo));
  const handleLimitChange = limit => { dispatch(setPerPage(Number(limit))); dispatch(setPage(1)); };

useEffect(() => {
  dispatch(
    fetchAllEmployee({
      page,
      limit: perPage,
      search: searchTerm || undefined,
      status: statusFilter.length ? statusFilter : undefined,
      role: roleFilter.length ? roleFilter[0] : undefined, 
    })
  );
  dispatch(fetchEmployeeStats());
}, [dispatch, page, perPage, searchTerm, statusFilter, roleFilter]);


  const smCardsData = [
    { name: 'Total Employees', totalPrice: stats.totalUsers, btnIcon: <NotepadText size={15} />, iconColor: 'bg-[#DCFCE7]', textColor: 'text-[#0ea5e9]' },
    { name: 'Active Employees', totalPrice: stats.activeUsers, btnIcon: <ArrowUp size={15} />, iconColor: 'bg-[#DCFCE7]', textColor: 'text-[#16A34A]' },
    { name: 'Resigned Employees', totalPrice: stats.resignedUsers, btnIcon: <ArrowDown size={15} />, iconColor: 'bg-[#DCFCE7]', textColor: 'text-[#f59e0b]' },
    { name: 'Blocked Employees', totalPrice: stats.blockedUsers, btnIcon: <Trash size={15} />, iconColor: 'bg-[#DCFCE7]', textColor: 'text-[#ef4444]' }
  ];

  return (
    <>
      <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Employee Management</h2>
          <p className='text-muted-foreground'>Analyze your Employee Data</p>
        </div>
        <AddButton onClick={() => setOpen(true)} text='Add Employee' />
      </div>

      <div className='py-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {statsLoading ? Array.from({ length: 4 }).map((_, i) => <SmCardSkeleton key={i} />)
          : smCardsData.map((card, idx) => <SmCard key={idx} {...card} />)}
      </div>

      {/* Filters */}
      <div className='flex items-center gap-3 pb-4'>
        <Input
          placeholder='Search user by name'
          className='h-8 w-[150px] sm:w-[350px]'
          onChange={e => setSearchTerm(e.target.value)}
        />
        <FilterSelect
          label='Status'
          value={statusFilter}
          setValue={setStatusFilter}
          options={Object.entries(EMPLOYEESS_STATUS).map(([_, value]) => ({
            label: value.charAt(0).toUpperCase() + value.slice(1),
            value: value // keep same as DB
          }))}
        />
        <FilterSelect
          label='Role'
          value={roleFilter}
          setValue={setRoleFilter}
          options={Object.entries(EMPLOYEES_ROLE).map(([_, value]) => ({
            label: value.charAt(0).toUpperCase() + value.slice(1),
            value: value // keep same as DB (lowercase)
          }))}
        />
      </div>

      {/* Table */}
      <div className='overflow-hidden rounded-md border' ref={printRef}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup, i) => (
              <TableRow key={i}>
                {headerGroup.headers.map((header, idx) => (
                  <TableHead key={idx}>{flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {listLoading ? (
              <TableSkeleton columnsCount={columns.length} />
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.original.userId}>
                  {row.getVisibleCells().map(cell => <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>)}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>No results.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <TablePagination
        totalRecords={totalRows}
        totalPages={totalPages}
        limit={perPage}
        currentPage={page}
        onLimitChange={handleLimitChange}
        onPageChange={handlePageChange}
      />

      {/* Modals */}
      {open && (
        <AddEditEmployee
          isEdit={isEdit}
          open={open}
          onClose={() => { dispatch(setSelectedEmployee(null)); setOpen(false); setEdit(false); }}
        />
      )}
      {deleteModal && (
        <DeleteEmployee
          open={deleteModal}
          onClose={() => { dispatch(setSelectedEmployee(null)); setDeleteModal(false); }}
        />
      )}
    </>
  );
};

export default Employees;
