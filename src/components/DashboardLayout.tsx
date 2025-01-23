import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { Outlet } from "react-router";

const DashboardLayout = () => {
	return (
		<SidebarProvider>
			<AppSidebar />
			<Outlet />
			<Toaster />
		</SidebarProvider>
	);
};
export default DashboardLayout;
