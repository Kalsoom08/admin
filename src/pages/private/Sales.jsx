import { useEffect, useState } from 'react';
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

const columnHelper = createColumnHelper();
const SmCardSkeleton = () => <div className='animate-pulse bg-gray-200 h-20 w-full rounded-md'></div>;

const Sales = () => {
  const dispatch = useDispatch();
  const { data, listLoading, totalRows, page, perPage, totalPages, stats, statsLoading } = useSelector(state => state.sales);
  const { data: categoryOptions } = useSelector(state => state.category);

  const [itemFilter, setItemFilter] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    dispatch(fetchAllSales({ page, limit: perPage, items: itemFilter, fromDate, toDate }));
    dispatch(fetchSalesStats());
  }, [page, perPage, itemFilter, fromDate, toDate, dispatch]);

  useEffect(() => { if (!categoryOptions?.length) dispatch(fetchCategoryOptions()); }, [categoryOptions, dispatch]);

  const columns = [
    columnHelper.accessor('itemName', { header: 'Item Name' }),
    columnHelper.accessor('category', { header: 'Category' }),
    columnHelper.accessor('unitSold', { header: 'Unit Sold' }),
    columnHelper.accessor('revenue', { header: 'Revenue' }),
    columnHelper.accessor('expense', { header: 'Expense' })
  ];

  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <>
 
      <div className='py-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {statsLoading ? Array(4).fill(0).map((_, idx) => <SmCardSkeleton key={idx} />) :
          [
            { name: 'Today Sales', totalPrice: stats?.todaySale, btnIcon: <ChartLine /> },
            { name: 'Monthly Sales', totalPrice: stats?.saleThisMonth, btnIcon: <FaDollarSign /> },
            { name: 'Best Selling Item', totalPrice: stats?.analytics?.topSalesItems?.[0]?.name },
            { name: 'Lowest Selling Item', totalPrice: stats?.lowestSellingItem?.name }
          ].map((card, idx) => (
            <SmCard key={idx} {...card} />
          ))
        }
      </div>
       
      <div className='flex flex-col lg:flex-row gap-5 py-4'>
        <div className='w-full lg:w-[49%] bg-card p-4 rounded-xl'>
          <h1>Top Selling Items</h1>
          {statsLoading ? <ChartSkeleton /> :
            <BarCharts data={stats?.analytics?.topSalesItems?.map(i => ({ name: i.name, totalSold: Number(i.totalSold) })) || []} xKey='name' yKey='totalSold' />}
        </div>
        <div className='w-full lg:w-[49%] bg-card p-4 rounded-xl'>
          <h1>Sales By Category</h1>
          {statsLoading ? <ChartSkeleton /> :
            <PiLabelCharts data={stats?.analytics?.salesByCategory?.map(c => ({ categoryName: c.categoryName, totalSales: Number(c.totalSales) })) || []} nameKey='categoryName' valueKey='totalSales' />}
        </div>
      </div>

<div className='flex flex-wrap items-center gap-6 mb-4'>
  
  <div className='flex items-center gap-2'>
    <span className='text-sm text-gray-600'></span>
    <FilterSelect
      value={itemFilter}
      setValue={setItemFilter}
      options={data.map(item => ({ label: item.itemName, value: item.itemId }))}
      isMulti
      className='min-w-[200px]'
      label= 'Items'
    />
  </div>

  <div className='flex items-center gap-2'>
    <span className='text-sm text-gray-600'>From:</span>
    <Input
      type='date'
      value={fromDate}
      onChange={e => setFromDate(e.target.value)}
      className='w-40'
    />
  </div>

  <div className='flex items-center gap-2'>
    <span className='text-sm text-gray-600'>To:</span>
    <Input
      type='date'
      value={toDate}
      onChange={e => setToDate(e.target.value)}
      className='w-40'
    />
  </div>
</div>




      <div className='overflow-hidden rounded-md border mt-5'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(hg => (
              <TableRow key={hg.id}>
                {hg.headers.map(header => (
                  <TableHead key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {listLoading ? <TableSkeleton columnsCount={columns.length} /> :
              table.getRowModel().rows.length ? table.getRowModel().rows.map(row => (
                <TableRow key={row.original.itemId}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              )) :
                <TableRow>
                  <TableCell colSpan={columns.length} className='text-center'>No results.</TableCell>
                </TableRow>
            }
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
