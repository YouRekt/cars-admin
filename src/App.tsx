import LoginForm from "@/components/LoginForm";
import useAuth from "@/hooks/use-auth";
import { Navigate } from "react-router";

export default function App() {
	let token: string | null = null;

	try {
		[token] = useAuth(); // If this throws, it goes to catch
	} catch {
		token = null; // Explicitly handle logged-out state
	}

	// Redirect logged-in users
	if (token) return <Navigate to="/users" />;

	// Show login screen for logged-out users
	return (
		<main className="w-full h-dvh flex flex-col items-center justify-start pt-8 gap-8">
			<img src="/logo.svg" alt="logo" width={720} />
			<h1 className="text-6xl text-app-primary font-semibold">
				Admin Panel
			</h1>
			<LoginForm />
		</main>
	);
}
