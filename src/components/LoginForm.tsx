import { getCustomerToken } from "@/lib/utils";
import { UserContext } from "@/UserContext";
import { useContext, useState } from "react";
import { useNavigate } from "react-router";

const LoginForm = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const userContext = useContext(UserContext);
	const login = userContext?.login;
	if (!login) throw new Error("UserContext is not provided");
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError("");

		const credentials = btoa(`${username}:${password}`);

		try {
			const response = await fetch("/session", {
				method: "PUT",
				headers: {
					Authorization: `Basic ${credentials}`,
				},
				credentials: "include", // Include cookies
			});

			if (response.ok) {
				const token = getCustomerToken();
				if (token) {
					login(token); // Update the context with the user data
					navigate("/cars"); // Redirect to the dashboard
				}
			} else if (response.status === 400) {
				setError("Invalid credentials. Please try again.");
			} else {
				setError("An unexpected error occurred. Please try again.");
			}
		} catch (err) {
			console.error("Error during login:", err);
			setError("An unexpected error occurred. Please try again.");
		}
	};

	return (
		<div className="max-w-md w-full bg-white shadow-md rounded-lg p-6">
			<h1 className="text-2xl font-bold text-center mb-6">Login</h1>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label
						htmlFor="username"
						className="block text-sm font-medium text-gray-700"
					>
						Username
					</label>
					<input
						type="text"
						id="username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						required
						className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					/>
				</div>
				<div>
					<label
						htmlFor="password"
						className="block text-sm font-medium text-gray-700"
					>
						Password
					</label>
					<input
						type="password"
						id="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					/>
				</div>
				{error && <p className="text-red-600 text-sm">{error}</p>}
				<button
					type="submit"
					className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
				>
					Login
				</button>
			</form>
		</div>
	);
};

export default LoginForm;
