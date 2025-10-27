import { useEffect, useState, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@maincomponents/components/ui/table';
import { Badge } from '@maincomponents/components/ui/badge';
import { cn } from '@maincomponents/lib/utils';
import { Button } from '@maincomponents/components/ui/button';
import { Ellipsis, PenLine, Trash } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut
} from '@maincomponents/components/ui/dropdown-menu';
import AddEditItem from '@maincomponents/modal/AddEditItem';
import DeleteItem from '@maincomponents/modal/DeleteItem';
import TablePagination from '@maincomponents/Pagination';
import AddButton from '@maincomponents/Buttons/AddButton';
import { Input } from '@maincomponents/components/ui/input';
import FilterSelect from '@maincomponents/Inputs/FilterSelect';
import { fetchCategoryOptions } from '@redux/slice/categorySlice';
import { USER_STATUS, USER_STATUS_COLOR } from '@data/Constants';
import { fetchAllItem, setPage, setPerPage, setSelectedItem } from '@redux/slice/itemSlice';
import SmCard from '@maincomponents/Cards/SmCard';
import TableSkeleton from '@maincomponents/loaders/TableSkeleton';

const columnHelper = createColumnHelper();
const SmCardSkeleton = () => <div className='animate-pulse bg-gray-200 h-20 w-full rounded-md'></div>;

const Items = () => {
  const dispatch = useDispatch();
  const { data, listLoading, totalRows, page, perPage, totalPages } = useSelector(state => state.item);
  const { data: categoryOptions } = useSelector(state => state.category);

  const [open, setOpen] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState([]); // array of selected category objects
  const [statusFilter, setStatusFilter] = useState([]);
  const printRef = useRef();

  const fetchCategory = async () => {
    if (!categoryOptions?.length) {
      await dispatch(fetchCategoryOptions());
    }
  };

  // Fetch items whenever filters or pagination change
  useEffect(() => {
    const categoryId = categoryFilter.length ? Number(categoryFilter[0]?.value || categoryFilter[0]) : undefined;

dispatch(
  fetchAllItem({
    page,
    limit: perPage,
    search: searchTerm || undefined,
    status: statusFilter.length ? statusFilter : undefined,
    categoryId: categoryFilter.length ? categoryFilter[0] : undefined,
  })
);

  }, [dispatch, page, perPage, searchTerm, statusFilter, categoryFilter]);

  const columns = useMemo(() => [
    columnHelper.accessor('name', {
      header: 'Item Name',
      cell: ({ row }) => (
        <div className='flex items-center gap-2'>
          {row.original.image && (
            <img
              src={`${import.meta.env.VITE_API_URL}/file/items/${row.original.image}`}
              alt={row.original.name}
              className='w-8 h-8 rounded-full object-cover'
            />
          )}
          <span>{row.original.name || 'Unnamed Item'}</span>
        </div>
      )
    }),
    columnHelper.accessor('category', {
      header: 'Category',
      cell: ({ row }) => (
        <Badge variant='outline' className='capitalize'>
          {row.original.category?.name || 'Unknown'}
        </Badge>
      )
    }),
    columnHelper.accessor('price', { header: 'Price', cell: ({ row }) => row.original.price }),
    columnHelper.accessor('stock', { header: 'Stock', cell: ({ row }) => row.original.stock }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant='outline' className={cn('capitalize', USER_STATUS_COLOR.get(row.original.status))}>
          {row.original.status}
        </Badge>
      )
    }),
    columnHelper.accessor('actions', {
      header: 'Actions',
      cell: ({ row }) => (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='flex h-8 w-8 p-0'>
              <Ellipsis className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-[160px]'>
            <DropdownMenuItem onClick={() => {
              dispatch(setSelectedItem(row.original));
              setEdit(true);
              setOpen(true);
            }}>
              Edit
              <DropdownMenuShortcut>
                <PenLine size={16} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => {
              dispatch(setSelectedItem(row.original));
              setDeleteModal(true);
            }} className='text-red-500!'>
              Delete
              <DropdownMenuShortcut>
                <Trash size={16} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    })
  ], [dispatch]);

  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });

  const handlePageChange = p => dispatch(setPage(p));
  const handleLimitChange = limit => {
    dispatch(setPerPage(Number(limit)));
    dispatch(setPage(1));
  };

  const smCardsData = [
    { name: 'Total Items', totalPrice: totalRows, btnIcon: <Ellipsis size={15} />, iconColor: 'bg-[#DCFCE7]', textColor: 'text-[#0ea5e9]' },
    { name: 'Active Items', totalPrice: data.filter(i => i.status?.toLowerCase() === 'active').length, btnIcon: <Ellipsis size={15} />, iconColor: 'bg-[#DCFCE7]', textColor: 'text-[#16A34A]' },
    { name: 'Inactive Items', totalPrice: data.filter(i => i.status?.toLowerCase() === 'inactive').length, btnIcon: <Ellipsis size={15} />, iconColor: 'bg-[#DCFCE7]', textColor: 'text-[#f59e0b]' },
    { name: 'Out of Stock', totalPrice: data.filter(i => Number(i.stock) === 0).length, btnIcon: <Ellipsis size={15} />, iconColor: 'bg-[#DCFCE7]', textColor: 'text-[#ef4444]' }
  ];

  return (
    <>
      <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Item Management</h2>
          <p className='text-muted-foreground'>Manage and filter your inventory items</p>
        </div>
        <AddButton onClick={() => setOpen(true)} text='Add Item' />
      </div>

      <div className='py-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {listLoading ? Array.from({ length: smCardsData.length }).map((_, i) => <SmCardSkeleton key={i} />)
          : smCardsData.map((card, idx) => <SmCard key={idx} {...card} />)}
      </div>

      <div className='flex items-center gap-3 pb-4'>
        <Input
          placeholder='Search item'
          className='h-8 w-[150px] sm:w-[350px]'
          onChange={e => setSearchTerm(e.target.value)}
        />
        <FilterSelect
          label='Category'
          value={categoryFilter}
          setValue={setCategoryFilter}
          options={categoryOptions?.map(item => ({ label: item.name, value: item.categoryId }))}
          onOpen={fetchCategory}
        />
        <FilterSelect
          label='Status'
          value={statusFilter}
          setValue={setStatusFilter}
          options={Object.entries(USER_STATUS).map(([_, value]) => ({ label: value, value }))}
        />
      </div>

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
            {listLoading ? <TableSkeleton columnsCount={columns.length} />
              : table.getRowModel().rows.length ? table.getRowModel().rows.map((row, i) => (
                <TableRow key={i}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className='h-24 text-center'>No results.</TableCell>
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
        <AddEditItem
          isEdit={isEdit}
          open={open}
          onClose={() => {
            setOpen(false);
            setEdit(false);
            dispatch(setSelectedItem(null));
          }}
        />
      )}
      {deleteModal && <DeleteItem open={deleteModal} onClose={() => setDeleteModal(false)} />}
    </>
  );
};

export default Items;
