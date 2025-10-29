import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Button } from '@maincomponents/components/ui/button';
import { Input } from '@maincomponents/components/ui/input';
import { Badge } from '@maincomponents/components/ui/badge';
import { Ellipsis, PenLine, Trash } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@maincomponents/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@maincomponents/components/ui/dropdown-menu';
import AddButton from '@maincomponents/Buttons/AddButton';
import FilterSelect from '@maincomponents/Inputs/FilterSelect';
import TablePagination from '@maincomponents/Pagination';
import AddEditExpenses from '@maincomponents/modal/AddEditExpenses';
import DeleteExpenses from '@maincomponents/modal/DeleteExpenses';
import ChartSkeleton from '@maincomponents/loaders/ChartSkeleton';
import TableSkeleton from '@maincomponents/loaders/TableSkeleton';
import BarCharts from '@maincomponents/charts/BarCharts';
import PiLabelCharts from '@maincomponents/charts/PiLabelCharts';
import { CATEGORY_COLOR } from '@data/Constants';
import { fetchAllExpenses } from '@redux/actions/expense';
import { setPage, setPerPage, setSelectedExpense } from '@redux/slice/expensesSlice';

const columnHelper = createColumnHelper();

const Expenses = () => {
  const dispatch = useDispatch();
  const { data, listLoading, totalRows, page, perPage, totalPages } = useSelector(state => state.expenses);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemFilter, setItemFilter] = useState([]);
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [open, setOpen] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [allExpenses, setAllExpenses] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await dispatch(fetchAllExpenses({ limit: 100000 }));
      const fullData = res?.payload?.expensesData || res?.payload?.data || [];
      setAllExpenses(fullData);
    })();
  }, [dispatch]);

  const itemOptions = useMemo(() => {
    if (!data?.length) return [];
    const itemsMap = new Map();
    data.forEach(exp => {
      const item = exp.item;
      if (item && item.itemId && !itemsMap.has(item.itemId)) {
        itemsMap.set(item.itemId, {
          label: item.name || 'Unknown',
          value: item.itemId.toString(),
        });
      }
    });
    return Array.from(itemsMap.values());
  }, [data]);

  const apiParams = useMemo(() => {
    const params = {
      page,
      limit: perPage,
      search: searchTerm || undefined,
      itemId: itemFilter.length ? itemFilter.join(',') : undefined,
    };
    const isValidDate = date => date instanceof Date && !isNaN(date);
    if (isValidDate(dateRange.from)) params.from = dateRange.from.toISOString();
    if (isValidDate(dateRange.to)) params.to = dateRange.to.toISOString();
    return params;
  }, [page, perPage, searchTerm, itemFilter, dateRange]);

  useEffect(() => {
    dispatch(fetchAllExpenses(apiParams));
  }, [dispatch, apiParams]);

  const chartData = useMemo(() => {
    if (!allExpenses?.length) return { topFive: [], full: [] };
    const itemTotals = {};
    allExpenses.forEach(exp => {
      const itemName = exp.item?.name || exp.itemName || 'Unknown';
      itemTotals[itemName] = (itemTotals[itemName] || 0) + Number(exp.amount || 0);
    });
    const sorted = Object.entries(itemTotals)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
    return { topFive: sorted.slice(0, 5), full: sorted };
  }, [allExpenses]);

  const columns = useMemo(() => [
    columnHelper.accessor('expenseId', {
      header: 'Expense ID',
      cell: ({ row }) => <div>{row.original.expenseId}</div>,
    }),
    columnHelper.accessor('title', {
      header: 'Title',
      cell: ({ row }) => <div>{row.original.title}</div>,
    }),
    columnHelper.accessor('item', {
      header: 'Item',
      cell: ({ row }) => {
        const expense = row.original;
        const itemName = expense.item?.name || expense.itemName || 'N/A';
        const badgeColor = CATEGORY_COLOR.get(itemName) || '';
        return <Badge variant="outline" className={badgeColor}>{itemName}</Badge>;
      },
    }),
    columnHelper.accessor('amount', {
      header: 'Amount',
      cell: ({ row }) => <div>${Number(row.original.amount).toLocaleString()}</div>,
    }),
    columnHelper.accessor('createdAt', {
      header: 'Date',
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt);
        return <div>{date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>;
      },
    }),
    columnHelper.accessor('addEditBy', {
      header: 'Added By',
      cell: ({ row }) => row.original.addEditBy?.fullName || 'N/A',
    }),
    columnHelper.accessor('actions', {
      header: 'Actions',
      cell: ({ row }) => (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex h-8 w-8 p-0">
              <Ellipsis className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuItem onClick={() => {
              dispatch(setSelectedExpense(row.original));
              setEdit(true);
              setOpen(true);
            }}>
              Edit <DropdownMenuShortcut><PenLine size={16} /></DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                dispatch(setSelectedExpense(row.original));
                setDeleteModal(true);
              }}
              className="text-red-500"
            >
              Delete <DropdownMenuShortcut><Trash size={16} /></DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    }),
  ], [dispatch]);

  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <>
      <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Expenses</h2>
          <p className="text-muted-foreground">Manage your expenses here.</p>
        </div>
        <AddButton onClick={() => setOpen(true)} text="Add Expenses" />
      </div>

  
      <div className="flex flex-col lg:flex-row gap-5 py-4">
        <div className="w-full lg:w-[46%] bg-card rounded-xl border shadow-sm p-4">
          <h1 className="text-xl font-bold mb-2">Top 5 Expensive Items</h1>
          {listLoading ? <ChartSkeleton /> : <BarCharts data={chartData.topFive} xKey="category" yKey="amount" />}
        </div>
        <div className="w-full lg:w-[49%] bg-card rounded-xl border shadow-sm p-4">
          <h1 className="text-xl font-bold mb-2">Expense By Item</h1>
          {listLoading ? <ChartSkeleton /> : <PiLabelCharts data={chartData.full} nameKey="category" valueKey="amount" />}
        </div>
      </div>


      <div className="flex flex-wrap gap-3 items-center mb-4">
        <Input
          placeholder="Search by title or expense ID"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full sm:w-[250px]"
        />

        <FilterSelect label="Item" value={itemFilter} setValue={setItemFilter} options={itemOptions} />

   
        <div className="flex flex-wrap gap-3 sm:gap-4 items-center">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-sm text-gray-600 min-w-[40px]">From:</span>
            <Input
              type="date"
              value={dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : ''}
              onChange={e => {
                const value = e.target.value;
                setDateRange(prev => ({
                  ...prev,
                  from: value ? new Date(value) : null,
                  to: prev.to && value && new Date(value) > prev.to ? null : prev.to
                }));
              }}
              className="w-full sm:w-40"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-sm text-gray-600 min-w-[40px]">To:</span>
            <Input
              type="date"
              value={dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : ''}
              min={dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : ''}
              onChange={e => {
                const value = e.target.value;
                setDateRange(prev => ({
                  ...prev,
                  to: value ? new Date(value) : null
                }));
              }}
              className="w-full sm:w-40"
              disabled={!dateRange.from}
            />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(group => (
              <TableRow key={group.id}>
                {group.headers.map(header => (
                  <TableHead key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {listLoading ? (
              <TableSkeleton columnsCount={columns.length} />
            ) : data?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.original.expenseId}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
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
        onLimitChange={limit => dispatch(setPerPage(limit))}
        onPageChange={pageNo => dispatch(setPage(pageNo))}
      />

      {open && (
        <AddEditExpenses
          isEdit={isEdit}
          open={open}
          onClose={() => {
            setOpen(false);
            setEdit(false);
            dispatch(setSelectedExpense(null));
          }}
        />
      )}

      {deleteModal && (
        <DeleteExpenses
          open={deleteModal}
          onClose={() => {
            setDeleteModal(false);
            dispatch(setSelectedExpense(null));
          }}
        />
      )}
    </>
  );
};

export default Expenses;
