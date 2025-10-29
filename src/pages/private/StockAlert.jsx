import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@maincomponents/components/ui/table';
import { Input } from '@maincomponents/components/ui/input';
import { Badge } from '@maincomponents/components/ui/badge';
import { cn } from '@maincomponents/lib/utils';
import { Button } from '@maincomponents/components/ui/button';
import FilterSelect from '@maincomponents/Inputs/FilterSelect';
import TablePagination from '@maincomponents/Pagination';
import SmCard from '@maincomponents/Cards/SmCard';
import TableSkeleton from '@maincomponents/loaders/TableSkeleton';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuShortcut } from '@maincomponents/components/ui/dropdown-menu';
import { TriangleAlert, Clock2, Eye, BugOff, Ellipsis, PenLine, Trash } from 'lucide-react';
import { fetchAllStock, setPage, setPerPage, setSelectedStock } from '@redux/slice/stockSlice';
import { FULFILMENT_STATUS_COLOR, STOCK_ALERT_COLOR, STOCK_STATUS_COLOR, STOCK_STATUSS } from '@data/Constants';
import AddButton from '@maincomponents/Buttons/AddButton';
import AddEditStockAlert from '@maincomponents/modal/AddEditStock';
import DeleteStockAlert from '@maincomponents/modal/DeleteStock';

const columnHelper = createColumnHelper();

const SmCardSkeleton = () => (
  <div className='animate-pulse h-20 w-full rounded-md bg-gray-200'></div>
);

const StockAlert = () => {
  let once = true;
  const dispatch = useDispatch();
  const { data, listLoading, totalRows, page, perPage, totalPages } = useSelector(state => state.stock);

  const [statusFilter, setStatusFilter] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const printRef = useRef();

  const columns = useMemo(() => [
    columnHelper.accessor('alertId', {
      header: 'Alert ID',
      cell: ({ row }) => <div className='w-fit text-nowrap pl-1'>{row.original.alertId}</div>
    }),
    columnHelper.accessor('itemName', {
      header: 'Item',
      cell: ({ row }) => <div className='w-fit text-nowrap'>{row.original.itemName}</div>
    }),
    columnHelper.accessor('stockStatus', {
      header: 'Stock Status',
      cell: ({ row }) => (
        <Badge
          variant='outline'
          className={cn('capitalize', STOCK_STATUS_COLOR.get(row.original.stockStatus))}
        >
          {row.original.stockStatus}
        </Badge>
      )
    }),
    columnHelper.accessor('fulfilmentStatus', {
      header: 'Fulfilment Status',
      cell: ({ row }) => (
        <Badge
          variant='outline'
          className={cn('capitalize', FULFILMENT_STATUS_COLOR.get(row.original.fulfilmentStatus))}
        >
          {row.original.fulfilmentStatus}
        </Badge>
      )
    }),
    columnHelper.accessor('note', {
      header: 'Message',
      cell: ({ row }) => <div className='truncate max-w-[200px]'>{row.original.note}</div>
    }),
    columnHelper.accessor('createdAt', {
      header: 'Created At',
      cell: ({ row }) => {
        const date = row.original.createdAt;
        return date
          ? new Date(date).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          : '-';
      }
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
            <DropdownMenuItem
              onClick={() => {
                dispatch(setSelectedStock(row.original));
                setEdit(true);
                setOpen(true);
              }}
            >
              Edit <DropdownMenuShortcut><PenLine size={16} /></DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                dispatch(setSelectedStock(row.original));
                setDeleteModal(true);
              }}
              className='text-red-500'
            >
              Delete <DropdownMenuShortcut><Trash size={16} /></DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    })
  ], [dispatch]);

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesSearch = item.itemName?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter.length
        ? statusFilter.includes(item.stockStatus)
        : true;
      return matchesSearch && matchesStatus;
    });
  }, [data, searchTerm, statusFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  const handlePageChange = pageNo => dispatch(setPage(pageNo));
  const handleLimitChange = limit => {
    dispatch(setPerPage(Number(limit)));
    dispatch(setPage(1));
  };

 useEffect(() => {
  dispatch(
    fetchAllStock({
      page,
      limit: perPage,
      search: searchTerm,
      status: statusFilter, 
    })
  );
}, [dispatch, page, perPage, searchTerm, statusFilter]);


  const smCardsData = [
    { name: 'Total Alerts', totalPrice: totalRows.toString(), iconColor: 'bg-[#DCFCE7]', textColor: 'text-[#16A34A]', btnIcon: <TriangleAlert size={15} /> },
    { name: 'Pending', totalPrice: data.filter(i => i.fulfilmentStatus === 'UNFULFILLED').length.toString(), iconColor: 'bg-[#FEF9C3]', textColor: 'text-[#CA8A04]', btnIcon: <Clock2 size={15} /> },
    { name: 'Review', totalPrice: data.filter(i => i.fulfilmentStatus === 'REVIEWED').length.toString(), iconColor: 'bg-[#E0F2FE]', textColor: 'text-[#0369A1]', btnIcon: <Eye size={15} /> },
    { name: 'Resolved', totalPrice: data.filter(i => i.fulfilmentStatus === 'RESOLVED').length.toString(), iconColor: 'bg-[#DCFCE7]', textColor: 'text-[#16A34A]', btnIcon: <BugOff size={15} /> }
  ];

  return (
    <>
      <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Stock Alerts</h2>
          <p className='text-muted-foreground'>Monitor and manage your stock alert system.</p>
        </div>
        <AddButton onClick={() => setOpen(true)} text='Add Stock Alert' />
      </div>

      {/* SmCards with Skeletons */}
      <div className='py-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {listLoading
          ? Array.from({ length: 4 }).map((_, idx) => <SmCardSkeleton key={idx} />)
          : smCardsData.map((card, idx) => (
              <SmCard
                key={idx}
                name={card.name}
                totalPrice={card.totalPrice}
                btnIcon={card.btnIcon}
                iconColor={card.iconColor}
                textColor={card.textColor}
              />
            ))
        }
      </div>

      <div className='flex items-center gap-3 pb-4'>
        <Input
          placeholder='Search item by name'
          className='h-8 w-[150px] sm:w-[350px]'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
<FilterSelect
  label='Status'
  value={statusFilter}
  setValue={setStatusFilter}
  options={Object.entries(STOCK_STATUSS).map(([_, value]) => ({ label: value, value }))}
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
            {listLoading ? (
              <TableSkeleton columnsCount={columns.length} />
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.original.alertId}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  No results.
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
        className='w-full'
      />

      {open && <AddEditStockAlert isEdit={isEdit} open={open} onClose={() => { dispatch(setSelectedStock(null)); setOpen(false); setEdit(false); }} />}
      {deleteModal && <DeleteStockAlert open={deleteModal} onClose={() => { dispatch(setSelectedStock(null)); setDeleteModal(false); }} />}
    </>
  );
};

export default StockAlert;
