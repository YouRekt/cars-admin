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

const EditUserForm = ({
	setUserAdded,
	userId,
}: {
	setUserAdded: (next: boolean) => void;
	userId: string;
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
		const response = await fetch(
			`https://${import.meta.env.VITE_VERCEL_URL}/customers/${userId}`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${id}`,
				},
				body: JSON.stringify(values),
			}
		);

		if (response.ok) {
			form.reset();
		}

		toast({
			title: "User information edited",
			description: `User's ${userId} email has been changed to ${values.email} successfully.`,
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
					<DialogClose>
						<Button type="submit">Submit</Button>
					</DialogClose>
					<DialogClose>
						<Button variant="destructive">Close</Button>
					</DialogClose>
				</div>
			</form>
		</Form>
	);
};
export default EditUserForm;
