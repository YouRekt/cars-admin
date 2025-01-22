import LoginForm from "@/components/LoginForm";
import { UserContext } from "@/UserContext";
import { useContext } from "react";
import { Navigate } from "react-router";

export default function App() {
	const userContext = useContext(UserContext);

	if (userContext?.user) {
		return <Navigate to="/cars" replace />;
	}

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
