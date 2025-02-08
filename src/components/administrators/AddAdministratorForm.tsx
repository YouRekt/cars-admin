"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DialogClose } from "@/components/ui/dialog";
import useAuth from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const formSchema = z.object({
	username: z.string().min(2, {
		message: "Username must be at least 2 characters.",
	}),
	password: z.string().min(5, {
		message: "Password must be at least 5 characters.",
	}),
});

const AddAdministratorForm = ({
	setAdministratorAdded,
}: {
	setAdministratorAdded: (next: boolean) => void;
}) => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: "",
			password: "",
		},
	});
	const [id] = useAuth();
	const { toast } = useToast();
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const response = await fetch(
			`https://${import.meta.env.VITE_API_URL}/administrators/`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${id}`,
				},
				body: JSON.stringify(values),
			}
		);

		if (response.ok) {
			form.reset();
			toast({
				title: "Administrator created",
				description: `Created administrator ${values.username} successfully.`,
			});
		} else
			toast({
				title: "Administrator creation failed",
				description: `Failed to create user ${values.username}.`,
			});

		setAdministratorAdded(true);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="username"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Username</FormLabel>
							<FormControl>
								<Input
									placeholder="Enter username"
									{...field}
								/>
							</FormControl>
							<FormDescription>
								This is the username of the Administrator.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Password</FormLabel>
							<div className="relative">
								<Input
									id="password"
									type={
										isPasswordVisible ? "text" : "password"
									}
									placeholder="Enter password"
									{...field}
								/>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
									onClick={() =>
										setIsPasswordVisible(!isPasswordVisible)
									}
									aria-label={
										isPasswordVisible
											? "Hide password"
											: "Show password"
									}
								>
									{isPasswordVisible ? (
										<EyeOff className="h-4 w-4" />
									) : (
										<Eye className="h-4 w-4" />
									)}
								</Button>
							</div>
							<FormDescription>
								This is the password of the Administrator.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="flex justify-between">
					{form.formState.isValid ? (
						<DialogClose>
							<Button type="submit">Submit</Button>
						</DialogClose>
					) : (
						<Button disabled>Submit</Button>
					)}
					<DialogClose>
						<Button variant="destructive">Close</Button>
					</DialogClose>
				</div>
			</form>
		</Form>
	);
};
export default AddAdministratorForm;
