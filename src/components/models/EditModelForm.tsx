"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DialogClose } from "@/components/ui/dialog";
import useAuth from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useCallback, useEffect, useState } from "react";
import { Brand, FuelType } from "@/components/models/AddModelForm";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Model } from "@/components/cars/columns";

const formSchema = z.object({
	brandId: z.coerce.number().int(),
	name: z.string().nonempty(),
	productionYear: z.coerce.number().gte(1900),
	fuelTypeId: z.coerce.number().int(),
	fuelCapacity: z.coerce.number().positive().int(),
	seatCount: z.coerce.number().positive().int(),
	doorCount: z.coerce.number().positive().int(),
	dailyRate: z.coerce.number().positive().multipleOf(0.01),
});

const EditModelForm = ({
	setModelAdded,
	modelId,
}: {
	setModelAdded: (next: boolean) => void;
	modelId: string;
}) => {
	const [id] = useAuth();
	const { toast } = useToast();

	const [brands, setBrands] = useState<Brand[]>([]);
	const [fuelTypes, setFuelTypes] = useState<FuelType[]>([]);
	const [model, setModel] = useState<Model>();

	const fetchModel = useCallback(async () => {
		const response = await fetch(`/api/models/${modelId}`, {
			headers: {
				Authorization: `Bearer ${id}`,
			},
		});

		if (response.ok) {
			const data = await response.json();
			setModel(data);
		}
	}, [id, modelId]);

	const fetchBrands = useCallback(async () => {
		const response = await fetch("/api/brands/", {
			headers: {
				Authorization: `Bearer ${id}`,
			},
		});

		if (response.ok) {
			const data = await response.json();
			setBrands(data);
		}
	}, [id]);

	const fetchFuelTypes = useCallback(async () => {
		const response = await fetch("/api/fuel-types/", {
			headers: {
				Authorization: `Bearer ${id}`,
			},
		});

		if (response.ok) {
			const data = await response.json();
			setFuelTypes(data);
		}
	}, [id]);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			brandId: 0,
			name: "",
			productionYear: new Date().getFullYear() - 10,
			fuelTypeId: 0,
			fuelCapacity: 0,
			seatCount: 0,
			doorCount: 0,
			dailyRate: 0,
		},
	});

	useEffect(() => {
		fetchModel();
		fetchBrands();
		fetchFuelTypes();
	}, [fetchBrands, fetchFuelTypes, fetchModel]);

	useEffect(() => {
		form.setValue("name", model!.name);
		form.setValue("productionYear", model!.productionYear);
		form.setValue("fuelCapacity", model!.fuelCapacity);
		form.setValue("seatCount", model!.seatCount);
		form.setValue("doorCount", model!.doorCount);
		form.setValue("dailyRate", model!.dailyRate);
	}, [model, form]);

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const response = await fetch(`/api/models/${modelId}`, {
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
			title: "Model information edited",
			description: `Model's ${modelId} data has been changed successfully.`,
		});

		setModelAdded(true);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<div className="flex gap-4">
					<div>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Model Name</FormLabel>
									<FormControl>
										<Input
											type="text"
											placeholder="Enter model name"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="brandId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Brand</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value.toString()}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select a brand" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{brands.map((brand) => (
												<SelectItem
													key={brand.id}
													value={brand.id.toString()}
												>
													{brand.shortName}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="productionYear"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Production Year</FormLabel>
									<FormControl>
										<Input
											type="number"
											placeholder="Enter production year"
											{...field}
											min={1900}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="fuelTypeId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Fuel Type</FormLabel>
									<FormControl>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value.toString()}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select fuel type" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{fuelTypes.map((ft) => (
													<SelectItem
														key={ft.id}
														value={ft.id.toString()}
													>
														{ft.type}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div>
						<FormField
							control={form.control}
							name="fuelCapacity"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										{"Fuel Capacity (liters)"}
									</FormLabel>
									<FormControl>
										<Input
											type="number"
											placeholder="Enter fuel capacity"
											min={1}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="seatCount"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Seat Count</FormLabel>
									<FormControl>
										<Input
											type="number"
											placeholder="Enter seat count"
											min={1}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="doorCount"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Door Count</FormLabel>
									<FormControl>
										<Input
											type="number"
											placeholder="Enter door count"
											min={1}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="dailyRate"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Daily Rate</FormLabel>
									<FormControl>
										<Input
											type="number"
											min={1}
											step={0.01}
											placeholder="Enter daily rate"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</div>
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
};
export default EditModelForm;
