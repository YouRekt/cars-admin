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
import ProtectedRoute from "@/components/ProtectedRoute";
import SidebarButtonProvider from "@/components/SidebarButtonProvider";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<App />} />
				<Route element={<ProtectedRoute />}>
					<Route element={<DashboardLayout />}>
						<Route element={<SidebarButtonProvider />}>
							<Route path="users" element={<Users />} />
							<Route path="cars" element={<Cars />} />
							<Route path="rentals" element={<Rentals />} />
							<Route
								path="administrators"
								element={<Administrators />}
							/>
						</Route>
					</Route>
				</Route>
			</Routes>
		</BrowserRouter>
	</StrictMode>
);
