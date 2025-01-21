import LoginForm from "@/components/LoginForm";

export default function App() {
	return (
		<main className="w-full h-dvh flex flex-col items-center justify-start pt-8 gap-8">
			<img src="/logo.svg" alt="logo" width={720} />
			<h1 className="text-6xl">Admin Panel</h1>
			<LoginForm />
		</main>
	);
}
