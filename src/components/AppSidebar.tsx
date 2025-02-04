import { Car, FilePenLine, LogOut, ShieldCheck, User } from "lucide-react";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useNavigate } from "react-router";
import Cookies from "js-cookie";

// Menu items.
const items = [
	{
		title: "Users",
		url: "/users",
		icon: User,
	},
	{
		title: "Cars",
		url: "/cars",
		icon: Car,
	},
	{
		title: "Rentals",
		url: "/rentals",
		icon: FilePenLine,
	},
	{
		title: "Administrators",
		url: "/administrators",
		icon: ShieldCheck,
	},
];

export function AppSidebar() {
	const navigate = useNavigate();

	const user = localStorage.getItem("username");

	const handleLogout = () => {
		navigate("/", { replace: true });
		Cookies.remove("administrator-token");
		localStorage.removeItem("username");
	};

	return (
		<Sidebar>
			<SidebarHeader>
				<img src="/logo.svg" alt="Logo" />
				{user && (
					<h1 className="text-2xl text-app-primary font-medium text-center">{`Hello, ${user}!`}</h1>
				)}
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton
										asChild
										className="hover:bg-app-secondary hover:text-white font-medium text-lg [&>svg]:size-6"
									>
										<a href={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</a>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									className="hover:bg-app-secondary hover:text-white font-medium text-lg [&>svg]:size-6"
									onClick={handleLogout}
								>
									<div>
										<LogOut />
										<span>Log out</span>
									</div>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarFooter>
		</Sidebar>
	);
}
