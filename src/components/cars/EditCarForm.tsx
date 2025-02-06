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
    modelId: z.string().uuid(),
    locationId: z.string().uuid(),
    imageId: z.string().uuid(),
});

const EditCarForm = ({
	setCarAdded,
    modelId,
    locationId,
    imageId,
}: {
	setCarAdded: (next: boolean) => void;
	modelId: string;
    locationId: string;
    imageId: string;
}) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            modelId: modelId,
            locationId: locationId,
            imageId: imageId,
        },
    });
    const [id] = useAuth();
    const { toast } = useToast();

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const response = await fetch(`/api/cars/${modelId}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${id}`,
			},
			body: JSON.stringify(values),
		});

		if (response.ok) {
			form.reset();
		}

		toast({
			title: "Car information edited",
			description: `Car's ${modelId} modelId has been changed to ${values.modelId} successfully.`,
		});

		setCarAdded(true);
	}

	return (
		<Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="modelId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Model ID</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="00000000-0000-0000-0000-000000000000"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                This is the current car's model ID.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="locationId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Location ID</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="00000000-0000-0000-0000-000000000000"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                This is the car's Location ID.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="imageId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Image ID</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="00000000-0000-0000-0000-000000000000"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                This is the car's image ID.
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
export default EditCarForm;
