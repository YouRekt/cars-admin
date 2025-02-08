"use client";

import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
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
import useAuth from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
	file: z
		.instanceof(File)
		.refine(
			(file) => file.type === "image/jpeg" || file.type === "image/png",
			{ message: "Invalid file type" }
		),
});

export function ImageUploader() {
	const [id] = useAuth();
	const { toast } = useToast();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			file: new File([], "unknown", {
				type: "error",
			}),
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		const formData = new FormData();
		formData.append("file", values.file);

		const response = await fetch(
			`https://${process.env.VERCEL_URL}/images`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${id}`, // Ensure the token is valid
					// Do NOT set 'Content-Type', fetch will handle it for FormData
				},
				body: formData,
			}
		);

		if (response.ok) {
			form.reset();
			toast({
				title: "Model created",
				description: `Created model ${values.file.name} successfully.`,
			});
		} else
			toast({
				title: "Model creation failed",
				description: `Failed to create model ${values.file.name}.`,
			});

		console.log(values);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="file"
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					render={({ field: { value, onChange, ...fieldProps } }) => (
						<FormItem>
							<FormLabel>Image</FormLabel>
							<FormControl>
								<Input
									{...fieldProps}
									placeholder="Select file"
									type="file"
									accept="image/*"
									onChange={(e) => {
										onChange(
											e.target.files && e.target.files[0]
										);
									}}
								/>
							</FormControl>
							<FormDescription>
								This is your public display name.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="flex justify-between">
					{form.formState.isValid ? (
						<DialogClose asChild>
							<Button type="submit">Submit</Button>
						</DialogClose>
					) : (
						<Button disabled>Submit</Button>
					)}
					<DialogClose asChild>
						<Button variant="destructive">Close</Button>
					</DialogClose>
				</div>
			</form>
		</Form>
	);
}
export default ImageUploader;
