import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@maincomponents/components/ui/table';
import { Badge } from '@maincomponents/components/ui/badge';
import { cn } from '@maincomponents/lib/utils';
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
import { fetchAllCategory, fetchCategoryOptions } from '@redux/slice/categorySlice';

const columnHelper = createColumnHelper();

const SmCardSkeleton = () => <div className='animate-pulse bg-gray-200 h-20 w-full rounded-md'></div>;

const Sales = () => {
  let once = true;
  const dispatch = useDispatch();
  
    const onces = useRef(true);
  const { data, listLoading, totalRows, page, perPage, totalPages, stats, statsLoading } = useSelector(
    state => state.sales
  );
  const { data: categoryOptions } = useSelector(state => state.category);
 ;

  const [categoryFilter, setCategoryFilter] = useState([]);


  const [searchTerm, setSearchTerm] = useState('');
  const printRef = useRef();

  useEffect(() => {
    if (once) {
      once = false;
      dispatch(fetchAllSales({ page, limit: perPage }));
       dispatch(fetchSalesStats())
    }
  }, [page, perPage, dispatch]);

  const columns = useMemo(
    () => [
      columnHelper.accessor('itemName', {
        header: 'Item Name',
        cell: ({ row }) => <div className='w-fit text-nowrap'>{row.original.itemName}</div>
      }),
      columnHelper.accessor('category', {
        header: 'Category',
        cell: ({ row }) => (
          <Badge variant='outline' className={cn('capitalize')}>
            {row.original.category?.name || row.original.category || 'Uncategorized'}
          </Badge>
        )
      }),
      columnHelper.accessor('unitSold', { header: 'Unit Sold', cell: ({ row }) => row.original.unitSold }),
      columnHelper.accessor('revenue', { header: 'Revenue', cell: ({ row }) => row.original.revenue }),
      columnHelper.accessor('expense', { header: 'Expense', cell: ({ row }) => row.original.expense })
    ],
    []
  );

const filteredData = useMemo(() => {
  return data.filter(item => {
    const matchesSearch = item.itemName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter.length
      ? categoryFilter.some(category => 
          (item.category?.name || item.category)?.toLowerCase() === category.toLowerCase())
      : true;
    return matchesSearch && matchesCategory;
  });
}, [data, searchTerm, categoryFilter]);

  const table = useReactTable({ data: filteredData, columns, getCoreRowModel: getCoreRowModel() });

  const handlePageChange = pageNo => dispatch(setPage(pageNo));
  const handleLimitChange = limit => dispatch(setPerPage(limit));

  const smCardsData = useMemo(
    () => [
      {
        name: 'Total Sales (Today)',
        totalPrice: stats?.todaySale ? `Rs. ${stats.todaySale}` : null,
        btnIcon: <ChartLine size={25} />,
        iconColor: 'bg-[#DCFCE7]'
      },
      {
        name: 'Monthly Sales',
        totalPrice: stats?.saleThisMonth ? `Rs. ${stats.saleThisMonth}` : null,
        btnIcon: <FaDollarSign size={15} />,
        iconColor: 'bg-[#DCFCE7]'
      },
      {
        name: 'Best Selling Item',
        totalPrice: stats?.analytics?.topSalesItems?.[0]?.name || null,
        btnIcon: <FaDollarSign size={15} />,
        iconColor: 'bg-[#DCFCE7]'
      },
      {
        name: 'Lowest Selling Item',
        totalPrice: stats?.lowestSellingItem?.name || null,
        btnIcon: <FaDollarSign size={15} />,
        iconColor: 'bg-[#DCFCE7]'
      }
    ],
    [stats]
  );

  const topItems = stats?.analytics?.topSalesItems?.map(i => ({ name: i.name, totalSold: Number(i.totalSold) })) || [];
  const salesByCategory =
    stats?.analytics?.salesByCategory?.map(c => ({ categoryName: c.categoryName, totalSales: Number(c.totalSales) })) ||
    [];
  const fetchCategory = async () => {
    if (!categoryOptions?.length) {
      await dispatch(fetchCategoryOptions());
    }
  };
  return (
    <>
      <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Sales Insights</h2>
          <p className='text-muted-foreground'>Analyze your sales performance and trends</p>
        </div>
      </div>

      <div className='py-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {statsLoading
          ? Array(4)
              .fill(0)
              .map((_, idx) => <SmCardSkeleton key={idx} />)
          : smCardsData.map((card, idx) => (
              <SmCard
                key={idx}
                name={card.name}
                totalPrice={card.totalPrice}
                btnIcon={card.btnIcon}
                iconColor={card.iconColor}
              />
            ))}
      </div>

      <div className='flex flex-col lg:flex-row justify-between gap-5 py-4'>
        <div className='w-full lg:w-[49%] bg-card text-card-foreground rounded-xl border shadow-sm px-4 py-2'>
          <h1 className='text-xl font-bold tracking-tight px-2 py-2'>Top Selling Items</h1>
          {statsLoading ? <ChartSkeleton /> : <BarCharts data={topItems} xKey='name' yKey='totalSold' />}
        </div>

        <div className='w-full lg:w-[49%] bg-card text-card-foreground rounded-xl border shadow-sm'>
          <h1 className='text-xl font-bold tracking-tight px-4 py-2'>Sales By Category</h1>
          {statsLoading ? (
            <ChartSkeleton />
          ) : (
            <PiLabelCharts data={salesByCategory} nameKey='categoryName' valueKey='totalSales' />
          )}
        </div>
      </div>

      <div className='flex justify-between items-center pt-4'>
        <div className='flex items-center justify-start gap-3'>
          <Input
            placeholder='Search by item name'
            className='h-8 w-[150px] sm:w-[350px]'
            onChange={e => setSearchTerm(e.target.value)}
          />
          <FilterSelect
            label='Category'
            value={categoryFilter}
            setValue={setCategoryFilter}
            options={categoryOptions?.map(item => ({
              label: item.name, // shown in dropdown
              value: item.name
            }))}
            onOpen={fetchCategory}
          />
        </div>
      </div>

      <div className='overflow-hidden rounded-md border mt-5' ref={printRef}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg, i) => (
              <TableRow key={i}>
                {hg.headers.map((header, idx) => (
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
                <TableRow key={row.original.itemId}>
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
    </>
  );
};

export default Sales;
