import { USER_STATUS, USER_STATUS_COLOR } from '@data/Constants';
import AddButton from '@maincomponents/Buttons/AddButton';
import { Button } from '@maincomponents/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@maincomponents/components/ui/table';
import { Input } from '@maincomponents/components/ui/input';
import { cn } from '@maincomponents/lib/utils';
import { Ellipsis, PenLine, Trash, Archive, Eye, CheckCircle, XCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import SmCard from '@maincomponents/Cards/SmCard';
import { Badge } from '@maincomponents/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@maincomponents/components/ui/dropdown-menu';
import AddEditCategory from '@maincomponents/modal/AddEditCategory';
import DeleteCategory from '@maincomponents/modal/DeleteCategory';
import FilterSelect from '@maincomponents/Inputs/FilterSelect';
import TablePagination from '@maincomponents/Pagination';
import { fetchAllCategory, setPage, setPerPage, setSelectedCategory } from '@redux/slice/categorySlice';
import TableSkeleton from '@maincomponents/loaders/TableSkeleton';

const columnHelper = createColumnHelper();
const SmCardSkeleton = () => <div className="animate-pulse bg-gray-200 h-20 w-full rounded-md"></div>;

const Category = () => {
  const dispatch = useDispatch();
  const { data, listLoading, totalRows, page, perPage, totalPages } = useSelector(state => state.category);
  const [statusFilter, setStatusFilter] = useState([]);
  const [open, setOpen] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const printRef = useRef();

  const columns = useMemo(() => [
    columnHelper.accessor('categoryId', { header: 'Category ID', cell: ({ row }) => <div className='w-fit text-nowrap pl-1'>{row.original.categoryId}</div> }),
    columnHelper.accessor('name', { header: 'Category Name', cell: ({ row }) => <div className="flex items-center gap-2">{row.original.image && <img src={`${import.meta.env.VITE_API_URL}/file/category/${row.original.image}`} alt={row.original.name} className="w-8 h-8 rounded-full object-cover"/>}<span>{row.original.name}</span></div> }),
    columnHelper.accessor('createdAt', { header: 'Created On', cell: ({ row }) => <div className='w-fit text-nowrap pl-1'>{new Date(row.original.createdAt).toLocaleDateString()}</div> }),
    columnHelper.accessor('status', { header: 'Status', cell: ({ row }) => <Badge variant='outline' className={cn('capitalize', USER_STATUS_COLOR.get(row.original.status))}>{row.original.status}</Badge> }),
    columnHelper.accessor('actions', { header: 'Actions', cell: ({ row }) => (
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild><Button variant='ghost' className='data-[state=open]:bg-muted flex h-8 w-8 p-0'><Ellipsis className='h-4 w-4'/></Button></DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-[160px]'>
          <DropdownMenuItem onClick={() => { dispatch(setSelectedCategory(row.original)); setEdit(true); setOpen(true); }}>Edit<DropdownMenuShortcut><PenLine size={16}/></DropdownMenuShortcut></DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => { dispatch(setSelectedCategory(row.original)); setDeleteModal(true); }} className='text-red-500!'>Delete<DropdownMenuShortcut><Trash size={16}/></DropdownMenuShortcut></DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )})
  ], [dispatch]);

  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });

  useEffect(() => {
    const statusQuery = statusFilter.length ? statusFilter.join(',') : '';
    dispatch(fetchAllCategory({ page, limit: perPage, search: searchTerm, status: statusQuery }));
  }, [dispatch, page, perPage, searchTerm, statusFilter]);

  const handlePageChange = (newPage) => dispatch(setPage(newPage));
  const handleLimitChange = (limit) => dispatch(setPerPage(limit));

  const smCardsData = [
    { name: 'Total Categories', totalPrice: totalRows, iconColor: 'bg-blue-100', textColor: 'text-blue-600', btnIcon: <Archive size={16}/> },
    { name: 'Active', totalPrice: data.filter(c => c.status === 'ACTIVE').length, iconColor: 'bg-green-100', textColor: 'text-green-600', btnIcon: <CheckCircle size={16}/> },
    { name: 'Inactive', totalPrice: data.filter(c => c.status === 'INACTIVE').length, iconColor: 'bg-yellow-100', textColor: 'text-yellow-600', btnIcon: <Eye size={16}/> },
    { name: 'Disabled', totalPrice: data.filter(c => c.status === 'DISABLED').length, iconColor: 'bg-red-100', textColor: 'text-red-600', btnIcon: <XCircle size={16}/> }
  ];

  return (
    <>
      <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Category Management</h2>
          <p className='text-muted-foreground'>Manage your category here.</p>
        </div>
        <AddButton onClick={() => setOpen(true)} text='Add Category' />
      </div>

      <div className='py-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {listLoading ? Array.from({ length: smCardsData.length }).map((_, i) => <SmCardSkeleton key={i} />) : smCardsData.map((card, i) => <SmCard key={i} {...card} />)}
      </div>

      <div className='flex gap-3 items-center mb-3'>
        <Input placeholder='Search category by name' value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        <FilterSelect label='Status' value={statusFilter} setValue={setStatusFilter} options={Object.entries(USER_STATUS).map(([_, value]) => ({ label: value, value }))} />
      </div>

      <div className='overflow-hidden mt-5 rounded-md border w-full'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(hg => <TableRow key={hg.id}>{hg.headers.map(h => <TableHead key={h.id}>{flexRender(h.column.columnDef.header, h.getContext())}</TableHead>)}</TableRow>)}
          </TableHeader>
          <TableBody>
            {listLoading ? <TableSkeleton columnsCount={columns.length} rowsCount={5} /> :
            table.getRowModel().rows.length ? table.getRowModel().rows.map(r => <TableRow key={r.id}>{r.getVisibleCells().map(c => <TableCell key={c.id}>{flexRender(c.column.columnDef.cell, c.getContext())}</TableCell>)}</TableRow>) :
            <TableRow><TableCell colSpan={columns.length} className='h-24 text-center'>No results.</TableCell></TableRow>}
          </TableBody>
        </Table>
        <TablePagination totalRecords={totalRows} totalPages={totalPages} limit={perPage} currentPage={page} onLimitChange={handleLimitChange} onPageChange={handlePageChange} />
      </div>

      {open && <AddEditCategory isEdit={isEdit} open={open} onClose={() => { dispatch(setSelectedCategory(null)); setOpen(false); setEdit(false); }} />}
      {deleteModal && <DeleteCategory open={deleteModal} onClose={() => { dispatch(setSelectedCategory(null)); setDeleteModal(false); }} />}
    </>
  );
};

export default Category;
