"use client";

import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	ColumnFiltersState,
	getFilteredRowModel,
	VisibilityState,
} from "@tanstack/react-table";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
} from "@/components/ui/pagination";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

export function DataTable<TData, TValue>({
	columns,
	data,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
		{}
	);

	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [rowSelection, setRowSelection] = useState({});

	const { toast } = useToast();

	const table = useReactTable({
		data,
		columns,
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	});

	const currentPage = table.getState().pagination.pageIndex;

	const generatePagination = () => {
		return (
			<>
				{Array.from({ length: table.getPageCount() })
					.map((_, i) => {
						const pageNumber = i + 1;
						const isCurrentPage = currentPage === i;

						return (
							<PaginationItem key={i}>
								<Button
									onClick={() => table.setPageIndex(i)}
									variant={
										isCurrentPage ? "outline" : "ghost"
									}
								>
									{pageNumber}
								</Button>
							</PaginationItem>
						);
					})
					.filter((_, i) => {
						const groupSize = 3;
						const totalPages = table.getPageCount();
						const lastGroupStart = Math.max(
							totalPages - (totalPages % groupSize || groupSize),
							0
						);
						if (totalPages <= groupSize) return true;
						if (currentPage >= lastGroupStart) {
							return i >= lastGroupStart - 2;
						} else {
							return (
								Math.floor(i / groupSize) ===
								Math.floor(currentPage / groupSize)
							);
						}
					})}
			</>
		);
	};

	return (
		<div>
			<div className="flex items-center py-4">
				<Input
					placeholder="Filter emails..."
					value={
						(table
							.getColumn("email")
							?.getFilterValue() as string) ?? ""
					}
					onChange={(event) =>
						table
							.getColumn("email")
							?.setFilterValue(event.target.value)
					}
					className="max-w-sm"
				/>
				<div className="ml-2 flex space-x-2">
					<Button
						variant={
							table.getSelectedRowModel().rows.length === 0
								? "outline"
								: "destructive"
						}
						className="ml-2"
						onClick={() => {
							const selectedRows = table
								.getSelectedRowModel()
								.rows.map((row) => row.original);

							toast({
								title: "Users removed",
								description: `${selectedRows.length} users removed.`,
							});
						}}
						disabled={table.getSelectedRowModel().rows.length === 0}
					>
						Remove Selected Users
					</Button>
					<Button
						variant="outline"
						onClick={() => {
							const selectedRows =
								table.getSelectedRowModel().rows;
							if (selectedRows.length > 0) {
								const ids = selectedRows.map(
									(row) => row.original.id
								);
								navigator.clipboard.writeText(ids.join(", "));
								toast({
									title: "IDs Copied",
									description: `${ids.length} IDs copied to clipboard.`,
								});
							} else {
								alert("No rows selected");
							}
						}}
						disabled={table.getSelectedRowModel().rows.length === 0}
					>
						Copy Selected IDs
					</Button>
					<Button
						variant="outline"
						onClick={() => {
							const selectedRows =
								table.getSelectedRowModel().rows;
							if (selectedRows.length > 0) {
								const usernames = selectedRows.map(
									(row) => row.original.username
								);
								navigator.clipboard.writeText(
									usernames.join(", ")
								);
								toast({
									title: "Usernames Copied",
									description: `${usernames.length} usernames copied to clipboard.`,
								});
							} else {
								alert("No rows selected");
							}
						}}
						disabled={table.getSelectedRowModel().rows.length === 0}
					>
						Copy Selected Usernames
					</Button>
					<Button
						variant="outline"
						onClick={() => {
							const selectedRows =
								table.getSelectedRowModel().rows;
							if (selectedRows.length > 0) {
								const emails = selectedRows.map(
									(row) => row.original.email
								);
								navigator.clipboard.writeText(
									emails.join(", ")
								);
								toast({
									title: "Emails Copied",
									description: `${emails.length} emails copied to clipboard.`,
								});
							} else {
								alert("No rows selected");
							}
						}}
						disabled={table.getSelectedRowModel().rows.length === 0}
					>
						Copy Selected Emails
					</Button>
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" className="ml-auto">
							Columns
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						{table
							.getAllColumns()
							.filter((column) => column.getCanHide())
							.map((column) => {
								return (
									<DropdownMenuCheckboxItem
										key={column.id}
										className="capitalize"
										checked={column.getIsVisible()}
										onCheckedChange={(value) =>
											column.toggleVisibility(!!value)
										}
									>
										{column.id}
									</DropdownMenuCheckboxItem>
								);
							})}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			{/* {table.getFilteredSelectedRowModel().rows.length > 0 && (
				<div className="flex-1 text-sm text-muted-foreground">
					{`${table.getFilteredSelectedRowModel().rows.length} of	${
						table.getFilteredRowModel().rows.length
					} row${
						table.getFilteredRowModel().rows.length > 1 && "s"
					} selected.`}
				</div>
			)} */}
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef
															.header,
														header.getContext()
												  )}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={
										row.getIsSelected() && "selected"
									}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="py-4">
				<Pagination>
					<PaginationContent>
						<PaginationItem>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => table.previousPage()}
								disabled={!table.getCanPreviousPage()}
							>
								Previous
							</Button>
						</PaginationItem>
						{currentPage > 2 && (
							<PaginationItem>
								<PaginationEllipsis />
							</PaginationItem>
						)}
						{generatePagination()}
						{currentPage < table.getPageCount() - 1 &&
							table.getPageCount() > 3 && (
								<PaginationItem>
									<PaginationEllipsis />
								</PaginationItem>
							)}
						<PaginationItem>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => table.nextPage()}
								disabled={!table.getCanNextPage()}
							>
								Next
							</Button>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			</div>
		</div>
	);
}
