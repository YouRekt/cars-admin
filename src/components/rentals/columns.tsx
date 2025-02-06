"use client";

import { Car } from "@/components/cars/columns";
import { ColumnDef } from "@tanstack/react-table";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../ui/tooltip";
import { Checkbox } from "../ui/checkbox";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Accessibility, CircleX, Info } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import RentalDetails from "./RentalDetails";

export type Customer = {
	id: string;
	email: string;
};

export type Rental = {
	id: string;
	car: Car;
	customer: Customer;
	startAt: string;
	endAt: string;
	isCancelled: boolean;
};

export const columns = (
	handleDelete: (id: string) => void
): ColumnDef<Rental>[] => [
	{
		accessorKey: "id",
		header: "Rental ID",
		cell: ({ row }) => {
			const id: string = row.getValue("id");

			return (
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<span
								onClick={() =>
									navigator.clipboard.writeText(id)
								}
								className="font-mono border rounded-md p-1"
							>
								{id}
							</span>
						</TooltipTrigger>
						<TooltipContent>
							<p>Click to copy rental ID</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			);
		},
	},
	{
		accessorKey: "customer",
		header: "User",
		cell: ({ row }) => {
			const id: string = row.original.customer.id;

			return (
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<span
								onClick={() =>
									navigator.clipboard.writeText(id)
								}
								className="font-mono border rounded-md p-1"
							>
								{id}
							</span>
						</TooltipTrigger>
						<TooltipContent>
							<p>Click to copy user ID</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			);
		},
	},
	{
		accessorKey: "car",
		header: "Car",
		cell: ({ row }) => {
			const id: string = row.original.customer.id;

			return (
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<span
								onClick={() =>
									navigator.clipboard.writeText(id)
								}
								className="font-mono border rounded-md p-1"
							>
								{id}
							</span>
						</TooltipTrigger>
						<TooltipContent>
							<p>Click to copy car ID</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			);
		},
	},
	{
		accessorKey: "startAt",
		header: "From",
		cell: ({ row }) =>
			new Intl.DateTimeFormat("pl-PL", {
				dateStyle: "short",
				timeStyle: "short",
				timeZone: "Europe/Warsaw",
			}).format(new Date(row.original.startAt as string)),
	},
	{
		accessorKey: "endAt",
		header: "To",
		cell: ({ row }) =>
			new Intl.DateTimeFormat("pl-PL", {
				dateStyle: "short",
				timeStyle: "short",
				timeZone: "Europe/Warsaw",
			}).format(new Date(row.original.startAt as string)),
	},
	{
		accessorKey: "isCancelled",
		header: "Cancelled?",
		cell: ({ row }) => {
			const external: boolean = row.getValue("isCancelled");

			return <Checkbox checked={external} className="cursor-default" />;
		},
	},
	{
		accessorKey: "actions",
		header: "Actions",
		cell: ({ row }) => {
			const id: string = row.getValue("id");

			return (
				<div className="flex gap-4">
					{!row.original.isCancelled ? (
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button size="icon" variant="destructive">
									<CircleX />
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>
										Are you absolutely sure?
									</AlertDialogTitle>
									<AlertDialogDescription>
										This action cannot be undone. This will
										permanently delete the rental.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogAction
										asChild
										className="bg-destructive hover:bg-destructive"
									>
										<Button
											onClick={() => handleDelete(id)}
										>
											Delete
										</Button>
									</AlertDialogAction>
									<AlertDialogCancel>
										Cancel
									</AlertDialogCancel>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					) : (
						<Button size="icon" variant="destructive" disabled>
							<Accessibility />
						</Button>
					)}
					<Dialog>
						<DialogTrigger asChild>
							<Button size="icon" variant="outline">
								<Info />
							</Button>
						</DialogTrigger>
						<DialogContent>
							<RentalDetails rental={row.original} />
						</DialogContent>
					</Dialog>
				</div>
			);
		},
	},
];
