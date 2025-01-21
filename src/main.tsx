import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/index.css";
import App from "@/App";
import { BrowserRouter, Route, Routes } from "react-router";
import DashboardLayout from "@/components/DashboardLayout";
import Cars from "@/components/Cars";
import Rentals from "@/components/Rentals";
import Administrators from "@/components/Administrators";
import Users from "@/components/Users";
import UserProvider from "@/components/UserProvider";
import ProtectedRoute from "@/components/ProtectedRoute";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<UserProvider>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<App />} />
					<Route
						path="unauthorized"
						element={<div>Unauthorized</div>}
					/>
					<Route
						element={
							<ProtectedRoute>
								<DashboardLayout />
							</ProtectedRoute>
						}
					>
						<Route
							path="users"
							element={
								<ProtectedRoute>
									<Users />
								</ProtectedRoute>
							}
						/>
						<Route
							path="cars"
							element={
								<ProtectedRoute>
									<Cars />
								</ProtectedRoute>
							}
						/>
						<Route
							path="rentals"
							element={
								<ProtectedRoute>
									<Rentals />
								</ProtectedRoute>
							}
						/>
						<Route
							path="administrators"
							element={
								<ProtectedRoute>
									<Administrators />
								</ProtectedRoute>
							}
						/>
					</Route>
				</Routes>
			</BrowserRouter>
		</UserProvider>
	</StrictMode>
);
