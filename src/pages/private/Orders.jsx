import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@maincomponents/components/ui/table";
import { Input } from "@maincomponents/components/ui/input";
import { Button } from "@maincomponents/components/ui/button";
import { Ellipsis, Trash, ClipboardList, PackageOpen, PackageCheck, PackageX } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@maincomponents/components/ui/dropdown-menu";
import TablePagination from "@maincomponents/Pagination";
import TableSkeleton from "@maincomponents/loaders/TableSkeleton";
import SmCard from "@maincomponents/Cards/SmCard";
import DeleteOrder from "@maincomponents/modal/DeleteOrder";
import { setPage, setPerPage, setSelectedOrder } from "@redux/slice/orderSlice";
import { fetchAllOrders, fetchOrderStats } from "@redux/actions/orders";

const columnHelper = createColumnHelper();
const SmCardSkeleton = () => <div className="animate-pulse h-20 w-full rounded-md bg-gray-200"></div>;

const Orders = () => {
  const dispatch = useDispatch();
  const { data, listLoading, totalRows, page, perPage, totalPages, stats, statsLoading } = useSelector(state => state.order);
  const [deleteModal, setDeleteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const printRef = useRef();

  const columns = useMemo(() => [
    columnHelper.accessor("orderId", { header: "Order ID", cell: ({ row }) => <div className="w-fit text-nowrap pl-1">{row.original.orderId}</div> }),
    columnHelper.accessor("description", { header: "Title", cell: ({ row }) => <div className="w-fit text-nowrap">{row.original.items?.[0]?.name || "N/A"}</div> }),
    columnHelper.accessor("totalAmount", { header: "Amount", cell: ({ row }) => <div className="w-fit text-nowrap">Rs {row.original.totalAmount ?? 0}</div> }),
    columnHelper.accessor("paymentMethod", { header: "Payment", cell: ({ row }) => <div className="w-fit text-nowrap capitalize">{row.original.paymentMethod || "Pending"}</div> }),
    columnHelper.accessor("status", { header: "Status", cell: ({ row }) => <div className="capitalize">{row.original.status || "N/A"}</div> }),
    columnHelper.accessor("actions", {
      header: "Actions",
      cell: ({ row }) => (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex h-8 w-8 p-0"><Ellipsis className="h-4 w-4" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[140px]">
            <DropdownMenuItem className="text-red-500" onClick={() => { dispatch(setSelectedOrder(row.original)); setDeleteModal(true); }}>Delete <Trash size={15} className="ml-auto" /></DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    })
  ], [dispatch]);

  const filteredData = useMemo(() => {
    return data.filter(order => String(order.orderId).includes(searchTerm));
  }, [data, searchTerm]);

  const table = useReactTable({ data: filteredData, columns, getCoreRowModel: getCoreRowModel() });

  useEffect(() => { dispatch(fetchAllOrders({ page, perPage })); }, [dispatch, page, perPage]);
  useEffect(() => { dispatch(fetchOrderStats()); }, [dispatch]);

  const handlePageChange = (newPage) => dispatch(setPage(newPage));
  const handleLimitChange = (limit) => dispatch(setPerPage(limit));

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
        {statsLoading ? Array.from({ length: 4 }).map((_, i) => <SmCardSkeleton key={i} />) : smCardsData.map((card, i) => <SmCard key={i} {...card} />)}
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-3">
        <Input
          placeholder="Search order ID"
          className="h-10 w-[150px] sm:w-[350px] rounded-md border border-gray-300 focus:ring-1 focus:ring-orange-500"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-hidden rounded-md border mt-5" ref={printRef}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup, i) => (
              <TableRow key={i}>
                {headerGroup.headers.map((header, j) => <TableHead key={j}>{flexRender(header.column.columnDef.header, header.getContext())}</TableHead>)}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {listLoading ? (
              <TableSkeleton columnsCount={columns.length} />
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row, i) => (
                <TableRow key={i}>
                  {row.getVisibleCells().map((cell, j) => <TableCell key={j}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>)}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">No results found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <TablePagination totalRecords={totalRows} totalPages={totalPages} limit={perPage} currentPage={page} onLimitChange={handleLimitChange} onPageChange={handlePageChange} className="w-full" />

      {deleteModal && <DeleteOrder open={deleteModal} onClose={() => { dispatch(setSelectedOrder(null)); setDeleteModal(false); }} />}
    </>
  );
};

export default Orders;
