import { SidebarTrigger } from "@/components/ui/sidebar";

const SidebarButtonProvider = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="w-full">
			<SidebarTrigger className="[&_svg]:size-6 text-app-primary" />
			<main>{children}</main>
		</div>
	);
};
export default SidebarButtonProvider;
