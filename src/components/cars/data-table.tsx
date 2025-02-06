"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getFilteredRowModel,
    ColumnFiltersState,
} from "@tanstack/react-table"

import { Input } from "@/components/ui/input";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import useAuth from "@/hooks/use-auth"
import { useCallback, useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
} from "@/components/ui/pagination";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Skeleton } from "@/components/ui/skeleton";

import { PlusCircle } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button"
import AddCarForm from "@/components/cars/AddCarForm";
import ImageUploader from "@/components/ImageUploader";

interface DataTableProps<TData, TValue> {
    columns: (
        handleDelete: (id: string) => void,
        setCarAdded: (next: boolean) => void
    ) => ColumnDef<TData, TValue>[]
}

export function DataTable<TData extends { id: string }, TValue>({
    columns,
}: DataTableProps<TData, TValue>) {
    const [id] = useAuth()
    const { toast } = useToast()
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

    const [data, setData] = useState<TData[]>([])
    const [pageCount, setPageCount] = useState(0)
    const [pageIndex, setPageIndex] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [carAdded, setCarAdded] = useState(false)
    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = async (carId: string) => {
        const response = await fetch(`/api/cars/${carId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${id}`,
            },
        });
        console.log(response)
        if (response.ok) {
            setCarAdded(true);
            toast({
                title: "Car removed",
                description: `Car ${carId} removed.`
            })
        } else if (response.status == 409) {
            toast({
                title: "Could not remove car",
                description: `Car ${carId} was not removed due to it being currently rented.`
            })
        } else {
            toast({
                title: "Unknown error",
                description: `Error is not defined in code: status${response.status}`
            })
        }
    }

    const fetchData = useCallback(
        async ({ page, size }: { page: number; size: number }) => {
            setIsLoading(true);
            const response = await fetch(
                `/api/cars/?page=${page}&size=${size}`,
                {
                    headers: {
                        Authorization: `Bearer ${id}`,
                    },
                }
            );
            const pageData = await response.json()
                setData(pageData.content)
                setPageCount(pageData.page.totalPages)
                setIsLoading(false)
        },
        [id]
    );

    useEffect(() => {
        fetchData({ page: pageIndex, size: pageSize })
        setCarAdded(false)
    }, [fetchData, pageIndex, pageSize, carAdded])


    const table = useReactTable({
        data,
        columns: columns(handleDelete, setCarAdded),
        getCoreRowModel: getCoreRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        manualPagination: true,
        pageCount: pageCount,
        state: {
            columnFilters,
        },
    })

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
                    placeholder="Filter IDs..."
                    value={
                        (table
                            .getColumn("id")
                            ?.getFilterValue() as string) ?? ""
                    }
                    onChange={(event) =>
                        table
                            .getColumn("id")
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
                            <PlusCircle /> Add Image
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Add Image</DialogTitle>
                        </DialogHeader>
                        <ImageUploader />
                    </DialogContent>
                </Dialog>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="ml-auto">
                            <PlusCircle /> Add Car
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Add Car</DialogTitle>
                        </DialogHeader>
                        <AddCarForm setCarAdded={setCarAdded} />
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
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
                                    <Skeleton className="h-4 w-4" />
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-4">
                                        <Skeleton className="h-10 w-12" />
                                        <Skeleton className="h-10 w-12" />
                                        <Skeleton className="h-10 w-12" />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={
                                        columns(handleDelete, setCarAdded)
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
    )
}
