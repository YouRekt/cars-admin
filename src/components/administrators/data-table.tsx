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
import { PlusCircle } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import AddAdministratorForm from "@/components/administrators/AddAdministratorForm";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface DataTableProps<TData extends { id: string }, TValue> {
	columns: (
		handleDelete: (id: string) => void,
		setAdministratorAdded: (next: boolean) => void
	) => ColumnDef<TData, TValue>[];
}

export function DataTable<TData extends { id: string }, TValue>({
	columns,
}: DataTableProps<TData, TValue>) {
	const [id] = useAuth();
	const { toast } = useToast();
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

	const [data, setData] = useState<TData[]>([]);
	const [pageCount, setPageCount] = useState(0);
	const [pageIndex, setPageIndex] = useState(0);
	const [pageSize, setPageSize] = useState(10);
	const [administratorAdded, setAdministratorAdded] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleDelete = async (administratorId: string) => {
		const response = await fetch(
			`https://${
				import.meta.env.VITE_API_URL
			}/administrators/${administratorId}`,
			{
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${id}`,
				},
				credentials: "include",
			}
		);

		if (response.ok) {
			setAdministratorAdded(true);
		}

		toast({
			title: "Administrator removed",
			description: `Administrator ${administratorId} removed.`,
		});
	};

	const fetchData = useCallback(
		async ({ page, size }: { page: number; size: number }) => {
			setIsLoading(true);
			const response = await fetch(
				`https://${
					import.meta.env.VITE_API_URL
				}/administrators/?page=${page}&size=${size}`,
				{
					headers: {
						Authorization: `Bearer ${id}`,
					},
					credentials: "include",
				}
			);
			const pageData = await response.json();
			setData(pageData.content);
			setPageCount(pageData.page.totalPages);
			setIsLoading(false);
		},
		[id]
	);

	useEffect(() => {
		fetchData({ page: pageIndex, size: pageSize });
		setAdministratorAdded(false);
	}, [fetchData, pageIndex, pageSize, administratorAdded]);

	const table = useReactTable({
		data,
		columns: columns(handleDelete, setAdministratorAdded),
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
			<div className="flex py-4 gap-4">
				<Input
					placeholder="Filter usernames..."
					value={
						(table
							.getColumn("username")
							?.getFilterValue() as string) ?? ""
					}
					onChange={(event) =>
						table
							.getColumn("username")
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
				<Dialog>
					<DialogTrigger asChild>
						<Button className="ml-auto">
							<PlusCircle /> Add Administrator
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-md">
						<DialogHeader>
							<DialogTitle>Add Administrator</DialogTitle>
							<DialogDescription>
								Input the administrator's email and click "Add"
								to create a new Administrator.
							</DialogDescription>
						</DialogHeader>
						<AddAdministratorForm
							setAdministratorAdded={setAdministratorAdded}
						/>
					</DialogContent>
				</Dialog>
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
						) : isLoading ? (
							<TableRow>
								<TableCell>
									<Skeleton className="h-4 w-72" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-4 w-32" />
								</TableCell>
								<TableCell>
									<div className="flex gap-4">
										<Skeleton className="h-10 w-10" />
										<Skeleton className="h-10 w-10" />
									</div>
								</TableCell>
							</TableRow>
						) : (
							<TableRow>
								<TableCell
									colSpan={
										columns(
											handleDelete,
											setAdministratorAdded
										).length
									}
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
