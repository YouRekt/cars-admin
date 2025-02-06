import { SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router";

const SidebarButtonProvider = () => {
	return (
		<div className="w-full">
			<SidebarTrigger className="[&_svg]:size-6 text-app-primary" />
			<main>
				<Outlet />
			</main>
		</div>
	);
};
export default SidebarButtonProvider;
