"use client";

import { useEffect, useState } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogClose } from "@/components/ui/dialog";
import useAuth from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
    modelId: z.string().uuid(),
    locationId: z.string().uuid(),
    imageId: z.string().uuid(),
});

const AddCarForm = ({ setCarAdded }: { setCarAdded: (next: boolean) => void }) => {
    const [id] = useAuth();
    const { toast } = useToast();
    const [images, setImages] = useState<{ id: string; url: string }[]>([]);
    const [loadingImages, setLoadingImages] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            modelId: "89505274-4115-4ded-b478-5c88a3e7fecd",
            locationId: "39fcf399-950f-4e57-a8ad-f8c4f51970e7",
            imageId: "",
        },
    });

    // Fetch images from the API
    useEffect(() => {
        const fetchImages = async () => {
            setLoadingImages(true);
            try {
                const response = await fetch("/api/images/", {
                    headers: {
                        Authorization: `Bearer ${id}`,
                    },
                });

                if (!response.ok) throw new Error("Failed to fetch images.");

                const data = await response.json(); // Response: { id: string, url: string }[]
                setImages(data);
            } catch (error) {
                console.error(error);
                toast({
                    title: "Error",
                    description: "Could not fetch images.",
                    variant: "destructive",
                });
            } finally {
                setLoadingImages(false);
            }
        };

        fetchImages();
    }, [id, toast]);

    // Handle form submission
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
            setCarAdded(true);
        } else {
            toast({
                title: "Car creation failed",
                description: `Failed to create car ${values.modelId}.`,
                variant: "destructive",
            });
        }
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
                            <FormDescription>This is the car's ID.</FormDescription>
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
                            <FormDescription>This is the car's Location ID.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Image selection dropdown */}
                <FormField
                    control={form.control}
                    name="imageId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Image</FormLabel>
                            <FormControl>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value || ""}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select an image" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {loadingImages ? (
                                            <SelectItem value="loading" disabled>Loading...</SelectItem>
                                        ) : images.length > 0 ? (
                                            images.map((img) => (
                                                <SelectItem key={img.id} value={img.id}>
                                                    <div className="flex items-center gap-2">
                                                        <img
                                                            src={img.url}
                                                            alt="Car"
                                                            className="w-10 h-10 rounded-md"
                                                        />
                                                        {img.id}
                                                    </div>
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <SelectItem value="no-images" disabled>No images found</SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormDescription>Select an existing image or upload a new one.</FormDescription>
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

export default AddCarForm;
