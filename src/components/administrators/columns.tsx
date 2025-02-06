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
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

import { ColumnDef } from "@tanstack/react-table";
import { Trash } from "lucide-react";

export type Administrator = {
	id: string;
	username: string;
};

export const columns = (
	handleDelete: (id: string) => void
): ColumnDef<Administrator>[] => [
	{
		accessorKey: "id",
		header: "ID",
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
							<p>Click to copy Administrator ID</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			);
		},
	},
	{
		accessorKey: "username",
		header: "Username",
		cell: ({ row }) => {
			const username: string = row.getValue("username");

			return (
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<span
								onClick={() =>
									navigator.clipboard.writeText(username)
								}
							>
								{username}
							</span>
						</TooltipTrigger>
						<TooltipContent>
							<p>Click to copy Administrator username</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			);
		},
	},
	{
		accessorKey: "actions",
		header: "Actions",
		cell: ({ row }) => {
			const id: string = row.getValue("id");

			return (
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
								permanently delete the user.
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
			);
		},
	},
];
