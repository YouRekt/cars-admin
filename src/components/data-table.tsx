"use client";

import {
	ColumnDef,
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	useReactTable,
} from "@tanstack/react-table";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import useAuth from "@/hooks/use-auth";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface DataTableProps<TData extends { id: string }, TValue> {
	columns: (handleDelete: (id: string) => void) => ColumnDef<TData, TValue>[];
}

export function DataTable<TData extends { id: string }, TValue>({
	columns,
}: DataTableProps<TData, TValue>) {
	const [id] = useAuth();
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

	const [data, setData] = useState<TData[]>([]);
	const [pageCount, setPageCount] = useState(0);
	const [pageIndex, setPageIndex] = useState(0);
	const [pageSize, setPageSize] = useState(10);

	const handleDelete = async (userId: string) => {
		const response = await fetch(`/api/customers/${userId}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${id}`,
			},
		});

		if (response.ok) {
			setData((data) => data.filter((d) => d.id !== userId));
		}
	};

	const fetchData = useCallback(
		async ({ page, size }: { page: number; size: number }) => {
			const response = await fetch(
				`/api/customers/?page=${page}&size=${size}`,
				{
					headers: {
						Authorization: `Bearer ${id}`,
					},
				}
			);
			const pageData = await response.json();
			setData(pageData.content);
			setPageCount(pageData.totalPages);
		},
		[id]
	);

	useEffect(() => {
		fetchData({ page: pageIndex, size: pageSize });
	}, [fetchData, pageIndex, pageSize]);

	const table = useReactTable({
		data,
		columns: columns(handleDelete),
		getCoreRowModel: getCoreRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		manualPagination: true,
		pageCount: pageCount,
		state: {
			columnFilters,
		},
	});

	const generatePagination = () => {
		return (
			<>
				{Array.from({ length: pageCount })
					.map((_, i) => {
						const pageNumber = i + 1;
						const isCurrentPage = pageIndex === i;

						return (
							<PaginationItem key={i}>
								<Button
									onClick={() => {
										setPageIndex(i);
										table.setPageIndex(i);
									}}
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
						const totalPages = pageCount;
						const lastGroupStart = Math.max(
							totalPages - (totalPages % groupSize || groupSize),
							0
						);
						if (totalPages <= groupSize) return true;
						if (pageIndex >= lastGroupStart) {
							return i >= lastGroupStart - 2;
						} else {
							return (
								Math.floor(i / groupSize) ===
								Math.floor(pageIndex / groupSize)
							);
						}
					})}
			</>
		);
	};

	return (
		<div>
			<div className="flex items-center py-4 gap-4">
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
				<Select onValueChange={(value) => setPageSize(parseInt(value))}>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder={pageSize} />
					</SelectTrigger>
					<SelectContent>
						{[10, 25, 50, 100].map((size) => (
							<SelectItem key={size} value={`${size}`}>
								{size}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
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
								onClick={() => {
									table.previousPage();
									setPageIndex((p) => p - 1);
								}}
								disabled={!table.getCanPreviousPage()}
							>
								Previous
							</Button>
						</PaginationItem>
						{pageIndex > 2 && (
							<PaginationItem>
								<PaginationEllipsis />
							</PaginationItem>
						)}
						{generatePagination()}
						{pageIndex < pageCount - 1 && pageCount > 3 && (
							<PaginationItem>
								<PaginationEllipsis />
							</PaginationItem>
						)}
						<PaginationItem>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => {
									table.nextPage();
									setPageIndex((p) => p + 1);
								}}
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
