"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import useAuth from "@/hooks/use-auth";

const BrandUploader = ({
	onBrandAdded,
}: {
	onBrandAdded?: (brand: { name: string; shortName: string }) => void;
}) => {
	const [name, setName] = useState("");
	const [shortName, setShortName] = useState("");
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();
	const [id] = useAuth(); // Authorization token

	const handleSubmit = async () => {
		if (!name || !shortName) {
			toast({
				title: "Missing fields",
				description: "Please fill in both fields.",
				variant: "destructive",
			});
			return;
		}

		setLoading(true);

		try {
			const response = await fetch("/backend/brands/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${id}`,
				},
				body: JSON.stringify({ name, shortName }),
			});

			if (!response.ok) throw new Error("Failed to add brand.");

			const newBrand = { name, shortName };
			onBrandAdded?.(newBrand); // Pass new brand to parent if needed

			toast({
				title: "Brand added",
				description: `Successfully added ${name} (${shortName}).`,
			});

			setName("");
			setShortName("");
		} catch (error) {
			toast({
				title: "Error",
				description:
					error instanceof Error
						? error.message
						: "An unknown error occurred",
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="space-y-4">
			<Input
				placeholder="Brand Name (e.g., Honda)"
				value={name}
				onChange={(e) => setName(e.target.value)}
			/>
			<Input
				placeholder="Short Name (e.g., HND)"
				value={shortName}
				onChange={(e) => setShortName(e.target.value)}
			/>
			<Button onClick={handleSubmit} disabled={loading}>
				{loading ? "Adding..." : "Add Brand"}
			</Button>
		</div>
	);
};

export default BrandUploader;
