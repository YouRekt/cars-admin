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
} from "@tanstack/react-table";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
} from "@/components/ui/pagination";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

export function DataTable<TData, TValue>({
	columns,
	data,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = useState<SortingState>([]);

	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

	const table = useReactTable({
		data,
		columns,
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			sorting,
			columnFilters,
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
			</div>
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
