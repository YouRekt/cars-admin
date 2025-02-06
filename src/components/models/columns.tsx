"use client";
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import EditModelForm from "@/components/models/EditModelForm";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash } from "lucide-react";

export type Model = {
	id: string;
	brandName: string;
	name: string;
	productionYear: number;
	fuelType: string;
	fuelCapacity: number;
	seatCount: number;
	doorCount: number;
	dailyRate: number;
};

export const columns = (
	handleDelete: (id: string) => void,
	setModelAdded: (next: boolean) => void
): ColumnDef<Model>[] => [
	{
		accessorKey: "id",
		header: "ID",
		enableHiding: false,
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
							<p>Click to copy Model ID</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			);
		},
	},
	{
		accessorKey: "name",
		header: "Name",
		cell: ({ row }) => {
			const name: string = row.getValue("name");

			return (
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<span
								onClick={() =>
									navigator.clipboard.writeText(name)
								}
							>
								{name}
							</span>
						</TooltipTrigger>
						<TooltipContent>
							<p>Click to copy model name</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			);
		},
	},
	{
		accessorKey: "brandName",
		header: "Brand Name",
	},
	{
		accessorKey: "productionYear",
		header: "Production Year",
	},
	{
		accessorKey: "fuelType",
		header: "Fuel Type",
	},
	{
		accessorKey: "fuelCapacity",
		header: "Fuel Capacity",
	},
	{
		accessorKey: "seatCount",
		header: "Seat Count",
	},
	{
		accessorKey: "doorCount",
		header: "Door Count",
	},
	{
		accessorKey: "dailyRate",
		header: "Daily Rate",
		cell: ({ row }) => {
			const dailyRate: number = row.getValue("dailyRate");
			const formatted = new Intl.NumberFormat("pl-PL", {
				style: "currency",
				currency: "PLN",
			}).format(dailyRate);

			return (
				<div className="font-medium text-right text-secondary">
					{formatted}
				</div>
			);
		},
	},
	{
		accessorKey: "actions",
		header: "Actions",
		enableHiding: false,
		cell: ({ row }) => {
			const id: string = row.getValue("id");

			return (
				<div className="flex gap-4">
					<Dialog>
						<DialogTrigger asChild>
							<Button size="icon" variant="outline">
								<Edit />
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>
									Edit model{" "}
									<span className="font-mono border rounded-md p-1">
										{id}
									</span>
								</DialogTitle>
								<DialogDescription>
									Input the model's details and click Submit
									to edit the selected Model.
								</DialogDescription>
							</DialogHeader>
							<EditModelForm
								setModelAdded={setModelAdded}
								modelId={id}
							/>
						</DialogContent>
					</Dialog>
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button size="icon" variant="destructive">
								<Trash />
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>
									Are you absolutely sure?
								</AlertDialogTitle>
								<AlertDialogDescription>
									This action cannot be undone. This will
									permanently delete the model.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogAction
									asChild
									className="bg-destructive hover:bg-destructive"
								>
									<Button onClick={() => handleDelete(id)}>
										Delete
									</Button>
								</AlertDialogAction>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			);
		},
	},
];
