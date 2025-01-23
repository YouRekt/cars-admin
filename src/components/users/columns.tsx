"use client";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUp, MoreHorizontal, Trash } from "lucide-react";

export type User = {
	id: string;
	username: string;
	email: string;
};

export const columns: ColumnDef<User>[] = [
	{
		accessorKey: "id",
		header: "ID",
	},
	{
		accessorKey: "username",
		header: "Username",
	},
	{
		accessorKey: "email",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
				>
					Email
					<ArrowUp
						className={`ml-2 h-4 w-4 transform transition-transform duration-200 ease-in-out ${
							column.getIsSorted() === "desc" ? "rotate-180" : ""
						}`}
					/>
				</Button>
			);
		},
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const user = row.original;

			const handleDelete = () => {
				toast({
					title: "User deleted",
					description: `User ${user.username} has been deleted.`,
				});
			};

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem
							onClick={() =>
								navigator.clipboard.writeText(user.id)
							}
						>
							Copy user ID
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() =>
								navigator.clipboard.writeText(user.username)
							}
						>
							Copy Username
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() =>
								navigator.clipboard.writeText(user.email)
							}
						>
							Copy Email
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild>
							<Button
								variant="destructive"
								size="sm"
								className="w-full"
								onClick={handleDelete}
							>
								<Trash /> Delete
							</Button>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
