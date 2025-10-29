import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@maincomponents/components/ui/table";
import { Input } from "@maincomponents/components/ui/input";
import { Button } from "@maincomponents/components/ui/button";
import { Ellipsis, Trash, ClipboardList, PackageOpen, PackageCheck, PackageX, ChevronDown, ChevronUp } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@maincomponents/components/ui/dropdown-menu";
import TablePagination from "@maincomponents/Pagination";
import TableSkeleton from "@maincomponents/loaders/TableSkeleton";
import SmCard from "@maincomponents/Cards/SmCard";
import FilterSelect from "@maincomponents/Inputs/FilterSelect";
import DeleteOrder from "@maincomponents/modal/DeleteOrder";
import { setPage, setPerPage, resetPage, setSelectedOrder } from "@redux/slice/orderSlice";
import { fetchAllOrders, fetchOrderStats } from "@redux/actions/orders";
import { PAYMENT_METHODS } from "../../data/Constants";

const columnHelper = createColumnHelper();
const SmCardSkeleton = () => <div className="animate-pulse h-20 w-full rounded-md bg-gray-200"></div>;

const Orders = () => {
  const dispatch = useDispatch();
  const { data, listLoading, totalRows, page, perPage, totalPages, stats } = useSelector((state) => state.order);

  const [deleteModal, setDeleteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentFilter, setPaymentFilter] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const printRef = useRef();

  // Reset page when filters change
  useEffect(() => {
    dispatch(resetPage());
  }, [searchTerm, paymentFilter, dispatch]);

  // Fetch orders whenever page, perPage, search, or payment filter changes
useEffect(() => {
  dispatch(
    fetchAllOrders({
      page,
      perPage,
      search: searchTerm || undefined,
      paymentMethods: paymentFilter.length ? paymentFilter : undefined,
    })
  );
}, [dispatch, page, perPage, searchTerm, paymentFilter]);


  // Fetch stats once
  useEffect(() => {
    dispatch(fetchOrderStats());
  }, [dispatch]);

  const toggleRow = (orderId) => setExpandedRows(prev => ({ ...prev, [orderId]: !prev[orderId] }));

  const columns = useMemo(() => [
    columnHelper.accessor("orderId", { header: "Order ID", cell: ({ row }) => <>#{row.original.orderId}</> }),
    columnHelper.accessor("items", { header: "Items", cell: ({ row }) => {
      const itemNames = row.original.items?.map(i => `${i.name} x${i.quantity}`).join(", ") || "N/A";
      return <div title={itemNames}>{itemNames.length > 50 ? `${itemNames.slice(0,50)}...` : itemNames}</div>;
    }}),
    columnHelper.accessor("totalAmount", { header: "Amount", cell: ({ row }) => <>Rs {row.original.totalAmount ?? 0}</> }),
    columnHelper.accessor("paymentMethod", { header: "Payment", cell: ({ row }) => <div className="capitalize">{row.original.paymentMethod || "Pending"}</div> }),
    columnHelper.accessor("status", { header: "Status", cell: ({ row }) => <div className="capitalize">{row.original.status || "N/A"}</div> }),
    columnHelper.accessor("actions", { header: "Actions", cell: ({ row }) => (
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex h-8 w-8 p-0"><Ellipsis className="h-4 w-4" /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[140px]">
          <DropdownMenuItem className="text-red-500" onClick={() => { dispatch(setSelectedOrder(row.original)); setDeleteModal(true); }}>Delete <Trash size={15} className="ml-auto" /></DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )}),
    columnHelper.accessor("expand", { header: "Expand", cell: ({ row }) => (
      <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => toggleRow(row.original.orderId)}>
        {expandedRows[row.original.orderId] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </Button>
    )}),
  ], [dispatch, expandedRows]);

  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });

  const smCardsData = [
    { name: "Total Orders", totalPrice: stats?.totalOrders ?? 0, iconColor: "bg-blue-100", textColor: "text-blue-600", btnIcon: <ClipboardList size={16} /> },
    { name: "Pending Orders", totalPrice: stats?.newOrders ?? 0, iconColor: "bg-yellow-100", textColor: "text-yellow-600", btnIcon: <PackageOpen size={16} /> },
    { name: "Delivered Orders", totalPrice: stats?.deliveredOrders ?? 0, iconColor: "bg-green-100", textColor: "text-green-600", btnIcon: <PackageCheck size={16} /> },
    { name: "Cancelled Orders", totalPrice: stats?.cancelledOrders ?? 0, iconColor: "bg-red-100", textColor: "text-red-600", btnIcon: <PackageX size={16} /> },
  ];

  return (
    <>
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Order Management</h2>
          <p className="text-muted-foreground">View and manage all orders</p>
        </div>
      </div>

      <div className="py-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats ? smCardsData.map((card,i) => <SmCard key={i} {...card} />) : Array.from({length:4}).map((_,i) => <SmCardSkeleton key={i} />)}
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-3">
        <Input placeholder="Search order ID or customer" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="h-10 w-[150px] sm:w-[350px] rounded-md border border-gray-300 focus:ring-1 focus:ring-orange-500" />
        <div className="h-10 w-[150px] sm:w-[200px]">
          <FilterSelect label="Payment" value={paymentFilter} setValue={setPaymentFilter} options={PAYMENT_METHODS} className="h-10" />
        </div>
        <div>
{paymentFilter.length > 0 && (
  <div className="inline-flex items-center gap-2 bg-yellow-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2">
    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
      {paymentFilter.join(", ")} Total:
    </span>
    <span className="text-sm font-bold text-gray-900 dark:text-white bg-white dark:bg-gray-800 px-2 py-1 rounded-md">
      Rs {((data || []).filter(order => paymentFilter.includes(order.paymentMethod)).reduce((sum, order) => {
        const orderTotal = (order.items || []).reduce(
          (s, item) => s + (Number(item.price) * Number(item.quantity) || 0), 0
        );
        return sum + orderTotal;
      }, 0)).toFixed(2)}
    </span>
  </div>
)}
</div>

      </div>

      <div className="overflow-hidden rounded-md border mt-5" ref={printRef}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg,i) => <TableRow key={i}>{hg.headers.map((h,j) => <TableHead key={j}>{flexRender(h.column.columnDef.header,h.getContext())}</TableHead>)}</TableRow>)}
          </TableHeader>
          <TableBody>
            {listLoading ? <TableSkeleton columnsCount={columns.length} /> 
              : table.getRowModel().rows.length ? table.getRowModel().rows.map((row,i) => (
                <React.Fragment key={i}>
                  <TableRow>{row.getVisibleCells().map((cell,j) => <TableCell key={j}>{flexRender(cell.column.columnDef.cell,cell.getContext())}</TableCell>)}</TableRow>
                  {expandedRows[row.original.orderId] && (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="bg-gray-50 dark:bg-gray-900 p-4">
                        <ul className="space-y-2">
                          {row.original.items.map(item => <li key={item.itemId} className="flex justify-between"><span>{item.name} x{item.quantity}</span><span>Rs {(item.price*item.quantity).toFixed(2)}</span></li>)}
                          {row.original.description && <li className="mt-2 text-sm text-gray-600 dark:text-gray-300"><strong>Note:</strong> {row.original.description}</li>}
                        </ul>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              )) : <TableRow><TableCell colSpan={columns.length} className="h-24 text-center">No results found.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>

      <TablePagination
        totalRecords={totalRows}
        totalPages={totalPages}
        limit={perPage}
        currentPage={page}
        onLimitChange={(limit)=>dispatch(setPerPage(limit))}
        onPageChange={(newPage)=>dispatch(setPage(newPage))}
      />

      {deleteModal && <DeleteOrder open={deleteModal} onClose={() => { dispatch(setSelectedOrder(null)); setDeleteModal(false); }} />}
    </>
  );
};

export default Orders;
