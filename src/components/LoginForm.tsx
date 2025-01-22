"use client";
import Cookies from "js-cookie";
import { UserContext } from "@/UserContext";
import { useContext } from "react";
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

const formSchema = z.object({
	username: z.string().min(2, {
		message: "Username must be at least 2 characters.",
	}),
	password: z.string().min(5, {
		message: "Password must be at least 5 characters.",
	}),
});

const LoginForm = () => {
	const userContext = useContext(UserContext);
	const login = userContext?.login;
	if (!login) throw new Error("UserContext is not provided");
	const navigate = useNavigate();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: "",
			password: "",
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		const credentials = btoa(`${values.username}:${values.password}`);

		try {
			const response = await fetch("/session", {
				method: "PUT",
				headers: {
					Authorization: `Basic ${credentials}`,
				},
				credentials: "include", // Include cookies
			});

			if (response.ok) {
				//const token = getCustomerToken();
				const token = Cookies.get("customer-token");
				if (token) {
					login(token); // Update the context with the user data
					navigate("/cars"); // Redirect to the dashboard
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
										<Input placeholder="test" {...field} />
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
									<FormControl>
										<Input
											placeholder="test123"
											type="password"
											{...field}
										/>
									</FormControl>
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
