"use client";

import {
	ColumnDef,
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	useReactTable,
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

import { PlusCircle } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import AddModelForm from "@/components/models/AddModelForm";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import BrandUploader from "@/components/BrandAdder";

interface DataTableProps<TData extends { id: string }, TValue> {
	columns: (
		handleDelete: (id: string) => void,
		setModelAdded: (next: boolean) => void
	) => ColumnDef<TData, TValue>[];
}

export function DataTable<TData extends { id: string }, TValue>({
	columns,
}: DataTableProps<TData, TValue>) {
	const [id] = useAuth();
	const { toast } = useToast();
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
		{}
	);

	const [data, setData] = useState<TData[]>([]);
	const [modelAdded, setModelAdded] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	const handleDelete = async (modelId: string) => {
		const response = await fetch(
			`https://${import.meta.env.VITE_VERCEL_URL}/models/${modelId}`,
			{
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${id}`,
				},
				credentials: "include",
			}
		);

		if (response.ok) {
			setModelAdded(true);
			toast({
				title: "Model removed",
				description: `Model ${modelId} removed.`,
			});
		} else {
			toast({
				title: "Error removing model",
				description: `Failed to remove model ${modelId} due to a car being based on it.`,
			});
		}
	};

	const fetchData = useCallback(async () => {
		const response = await fetch(
			`https://${import.meta.env.VITE_VERCEL_URL}/models/`,
			{
				headers: {
					Authorization: `Bearer ${id}`,
				},
				credentials: "include",
			}
		);
		const data = await response.json();
		setData(data);
		setIsLoading(false);
	}, [id]);

	useEffect(() => {
		fetchData();
		setModelAdded(false);
	}, [fetchData, modelAdded]);

	const table = useReactTable({
		data,
		columns: columns(handleDelete, setModelAdded),
		getCoreRowModel: getCoreRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		state: {
			columnVisibility,
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
									onClick={() => {
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
			<div className="flex py-4 gap-4">
				<Input
					placeholder="Filter models..."
					value={
						(table.getColumn("name")?.getFilterValue() as string) ??
						""
					}
					onChange={(event) =>
						table
							.getColumn("name")
							?.setFilterValue(event.target.value)
					}
					className="max-w-sm"
				/>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline">Columns</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						{table
							.getAllColumns()
							.filter((column) => column.getCanHide())
							.map((column) => {
								return (
									<DropdownMenuCheckboxItem
										key={column.id}
										className="cbackendtalize"
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
				<Dialog>
					<DialogTrigger asChild>
						<Button className="ml-auto">
							<PlusCircle /> Add Brand
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-md">
						<DialogHeader>
							<DialogTitle>Add Brand</DialogTitle>
							<DialogDescription>
								Input the brand's details and click Submit to
								create a new Brand.
							</DialogDescription>
						</DialogHeader>
						<BrandUploader />
					</DialogContent>
				</Dialog>
				<Dialog>
					<DialogTrigger asChild>
						<Button className="ml-auto">
							<PlusCircle /> Add Model
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-md">
						<DialogHeader>
							<DialogTitle>Add Model</DialogTitle>
							<DialogDescription>
								Input the model's details and click Submit to
								create a new Model.
							</DialogDescription>
						</DialogHeader>
						<AddModelForm setModelAdded={setModelAdded} />
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
									<Skeleton className="h-4 w-28" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-4 w-12" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-4 w-12" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-4 w-12" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-4 w-12" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-4 w-12" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-4 w-12" />
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
										columns(handleDelete, setModelAdded)
											.length
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
								}}
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
								onClick={() => {
									table.nextPage();
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
