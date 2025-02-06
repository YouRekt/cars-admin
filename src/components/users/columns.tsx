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
import { Checkbox } from "@/components/ui/checkbox";
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
import EditUserForm from "@/components/users/EditUserForm";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash } from "lucide-react";

export type User = {
	id: string;
	email: string;
	external: boolean;
};

export const columns = (
	handleDelete: (id: string) => void,
	setUserAdded: (next: boolean) => void
): ColumnDef<User>[] => [
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
							<p>Click to copy user ID</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			);
		},
	},
	{
		accessorKey: "email",
		header: "Email",
		cell: ({ row }) => {
			const email: string = row.getValue("email");

			return (
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<span
								onClick={() =>
									navigator.clipboard.writeText(email)
								}
							>
								{email}
							</span>
						</TooltipTrigger>
						<TooltipContent>
							<p>Click to copy user email</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			);
		},
	},
	{
		accessorKey: "external",
		header: "External",
		cell: ({ row }) => {
			const external: boolean = row.getValue("external");

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
					<Dialog>
						<DialogTrigger asChild>
							<Button size="icon" variant="outline">
								<Edit />
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>
									Edit user{" "}
									<span className="font-mono border rounded-md p-1">
										{id}
									</span>
								</DialogTitle>
								<DialogDescription>
									Input the user's email and click "Add" to
									create a new User.
								</DialogDescription>
							</DialogHeader>
							<EditUserForm
								setUserAdded={setUserAdded}
								userId={id}
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
				</div>
			);
		},
	},
];
