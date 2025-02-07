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

const formSchema = z.object({
	email: z.string().email(),
});

const AddUserForm = ({
	setUserAdded,
}: {
	setUserAdded: (next: boolean) => void;
}) => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
		},
	});
	const [id] = useAuth();
	const { toast } = useToast();

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const response = await fetch("/backend/customers/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${id}`,
			},
			body: JSON.stringify(values),
		});

		if (response.ok) {
			form.reset();
			toast({
				title: "User created",
				description: `Created user ${values.email} successfully.`,
			});
		} else
			toast({
				title: "User creation failed",
				description: `Failed to create user ${values.email}.`,
			});

		setUserAdded(true);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input
									placeholder="example@email.com"
									{...field}
								/>
							</FormControl>
							<FormDescription>
								This is the users email.
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
export default AddUserForm;
