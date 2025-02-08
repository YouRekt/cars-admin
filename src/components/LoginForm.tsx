"use client";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	FormRootError,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
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

const LoginForm = () => {
	const navigate = useNavigate();
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: "",
			password: "",
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const response = await fetch(
				`https://${import.meta.env.VITE_API_URL}/administrators/`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: "a",
						"Access-Control-Allow-Origin": "*",
						"Access-Control-Allow-Credentials": "true",
					},

					body: JSON.stringify(values),
				}
			);

			if (response.ok) {
				const token = Cookies.get("administrator-token");
				if (token) {
					try {
						const response = await fetch(
							`https://${
								import.meta.env.VITE_API_URL
							}/administrators/${token}`,
							{
								headers: {
									Authorization: `Bearer ${token}`,
									"Access-Control-Allow-Origin": "*",
									"Access-Control-Allow-Credentials": "true",
								},
							}
						);
						if (response.ok) {
							const username = await response.text();
							localStorage.setItem("username", username);
						}
					} catch {
						throw new Error("Username not found.");
					}
					navigate("/users");
				}
			} else if (response.status === 401) {
				form.setError("root", {
					type: "manual",
					message: "Invalid credentials. Please try again.",
				});
			} else if (response.status === 500) {
				form.setError("root", {
					type: "manual",
					message: "Internal server error. Please try again.",
				});
			} else {
				form.setError("root", {
					type: "manual",
					message: "An unexpected error occurred. Please try again.",
				});
			}
		} catch (err) {
			if (err instanceof Error) {
				form.setError("root", { type: "manual", message: err.message });
			} else {
				form.setError("root", {
					type: "manual",
					message: "An unexpected error occurred.",
				});
			}
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<Card>
					<CardHeader>
						<CardTitle>Login</CardTitle>
						<CardDescription>
							Enter your credentials to access the admin panel.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<FormField
							control={form.control}
							name="username"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Username</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter your username"
											{...field}
										/>
									</FormControl>
									<FormDescription>
										This is your username for the admin
										panel.
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
												isPasswordVisible
													? "text"
													: "password"
											}
											placeholder="Enter your password"
											{...field}
										/>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
											onClick={() =>
												setIsPasswordVisible(
													!isPasswordVisible
												)
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
										This is your password for the admin
										panel.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
					</CardContent>
					<CardFooter className="flex flex-col items-center gap-4">
						<Button type="submit" className="w-full">
							Submit
						</Button>
						<FormRootError />
					</CardFooter>
				</Card>
			</form>
		</Form>
	);
};

export default LoginForm;
