import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@maincomponents/components/ui/table';
import { Input } from '@maincomponents/components/ui/input';
import FilterSelect from '@maincomponents/Inputs/FilterSelect';
import TablePagination from '@maincomponents/Pagination';
import SmCard from '@maincomponents/Cards/SmCard';
import TableSkeleton from '@maincomponents/loaders/TableSkeleton';
import ChartSkeleton from '@maincomponents/loaders/ChartSkeleton';
import BarCharts from '@maincomponents/charts/BarCharts';
import PiLabelCharts from '@maincomponents/charts/PiLabelCharts';
import { ChartLine } from 'lucide-react';
import { FaDollarSign } from 'react-icons/fa6';
import { setPage, setPerPage, fetchAllSales, fetchSalesStats } from '@redux/slice/salesSlice';
import { fetchCategoryOptions } from '@redux/slice/categorySlice';
import api from '@utils/axiosInstance';

const columnHelper = createColumnHelper();
const SmCardSkeleton = () => <div className="animate-pulse bg-gray-200 h-20 w-full rounded-md"></div>;

const Sales = () => {
  const dispatch = useDispatch();
  const { data, listLoading, totalRows, page, perPage, totalPages, stats, statsLoading } = useSelector(state => state.sales);
  const { data: categoryOptions } = useSelector(state => state.category);

  const [itemFilter, setItemFilter] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [allItems, setAllItems] = useState([]);

  // Fetch items dynamically based on current filters
  useEffect(() => {
    const fetchFilteredItems = async () => {
      try {
        const params = { limit: 100000, page: 1 };

        if (fromDate) params.fromDate = fromDate;
        if (toDate) params.toDate = toDate;
        if (categoryFilter.length) params.category = categoryFilter;

        const res = await api.get('/sales', { params });
        setAllItems(res.data.items || []);
      } catch (error) {
        console.error('Failed to fetch items for filter', error);
      }
    };

    fetchFilteredItems();
  }, [fromDate, toDate, categoryFilter]);

  // Fetch paginated table data and stats
  useEffect(() => {
    dispatch(fetchAllSales({
      page,
      limit: perPage,
      items: itemFilter,
      fromDate,
      toDate,
      category: categoryFilter
    }));
    dispatch(fetchSalesStats());
  }, [page, perPage, itemFilter, fromDate, toDate, categoryFilter, dispatch]);

  // Fetch categories if not loaded
  useEffect(() => {
    if (!categoryOptions?.length) dispatch(fetchCategoryOptions());
  }, [categoryOptions, dispatch]);

  // Filter search locally
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    return data.filter(item => item.itemName?.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [data, searchTerm]);

  const columns = [
    columnHelper.accessor('itemName', { header: 'Item Name' }),
    columnHelper.accessor('category', { header: 'Category' }),
    columnHelper.accessor('unitSold', { header: 'Unit Sold' }),
    columnHelper.accessor('revenue', { header: 'Revenue' }),
    columnHelper.accessor('expense', { header: 'Expense' })
  ];

  const table = useReactTable({ data: filteredData, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <>
      {/* Stats Cards */}
      <div className="py-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsLoading
          ? Array(4).fill(0).map((_, idx) => <SmCardSkeleton key={idx} />)
          : [
              { name: 'Today Sales', totalPrice: stats?.todaySale, btnIcon: <ChartLine /> },
              { name: 'Monthly Sales', totalPrice: stats?.saleThisMonth, btnIcon: <FaDollarSign /> },
              { name: 'Best Selling Item', totalPrice: stats?.analytics?.topSalesItems?.[0]?.name },
              { name: 'Lowest Selling Item', totalPrice: stats?.lowestSellingItem?.name }
            ].map((card, idx) => <SmCard key={idx} {...card} />)}
      </div>

      {/* Charts */}
      <div className="flex flex-col lg:flex-row gap-5 py-4">
        <div className="w-full lg:w-[49%] bg-card p-4 rounded-xl">
          <h1>Top Selling Items</h1>
          {statsLoading ? <ChartSkeleton /> : (
            <BarCharts
              data={stats?.analytics?.topSalesItems?.map(i => ({
                name: i.name,
                totalSold: Number(i.totalSold)
              })) || []}
              xKey="name"
              yKey="totalSold"
            />
          )}
        </div>
        <div className="w-full lg:w-[49%] bg-card p-4 rounded-xl">
          <h1>Sales By Category</h1>
          {statsLoading ? <ChartSkeleton /> : (
            <PiLabelCharts
              data={stats?.analytics?.salesByCategory?.map(c => ({
                categoryName: c.categoryName,
                totalSales: Number(c.totalSales)
              })) || []}
              nameKey="categoryName"
              valueKey="totalSales"
            />
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <Input
          placeholder="Search by item name"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full sm:w-[250px]"
        />

        <FilterSelect
          value={itemFilter}
          setValue={setItemFilter}
          options={allItems.map(item => ({ label: item.itemName, value: item.itemId }))}
          isMulti
          className="min-w-[200px]"
          label="Items"
        />

        {/* Date Filters */}
        <div className="flex flex-wrap gap-3 sm:gap-4 items-center">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-sm text-gray-600 min-w-[40px]">From:</span>
            <Input
              type="date"
              value={fromDate}
              onChange={e => {
                const newFrom = e.target.value;
                setFromDate(newFrom);
                if (toDate && new Date(newFrom) > new Date(toDate)) setToDate('');
              }}
              className="w-full sm:w-40"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-sm text-gray-600 min-w-[40px]">To:</span>
            <Input
              type="date"
              value={toDate}
              min={fromDate || ''}
              onChange={e => setToDate(e.target.value)}
              className="w-full sm:w-40"
              disabled={!fromDate}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-md border mt-5">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(hg => (
              <TableRow key={hg.id}>
                {hg.headers.map(header => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {listLoading ? (
              <TableSkeleton columnsCount={columns.length} />
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.original.itemId}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">No results.</TableCell>
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
        onLimitChange={val => dispatch(setPerPage(val))}
        onPageChange={val => dispatch(setPage(val))}
      />
    </>
  );
};

export default Sales;
