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
import ImageUploader from "../ImageUploader";

const formSchema = z.object({
    modelId: z.string().uuid(),
    locationId: z.string().uuid(),
    imageId: z.string().uuid(),
});

const AddCarForm = ({
    setCarAdded,
}: {
    setCarAdded: (next: boolean) => void;
}) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            modelId: "89505274-4115-4ded-b478-5c88a3e7fecd", // DEFAULT HONDA-CIVIC FOR NOW
            locationId: "39fcf399-950f-4e57-a8ad-f8c4f51970e7", // SOME DEFAULT LOCATION @ /api/locations/
            imageId: "31784896-6326-441b-8b58-4688ecc41f9a" // SOME DEFAULT IMAGEID
        },
    });
    const [id] = useAuth();
    const { toast } = useToast();

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const response = await fetch("/api/cars/", {
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
                title: "Car created",
                description: `Created car ${values.modelId} successfully.`,
            });
        } else
            toast({
                title: "Car creation failed",
                description: `Failed to create car ${values.modelId}.`,
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
                                This is the car's ID.
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
                <ImageUploader/>
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

export default AddCarForm;
