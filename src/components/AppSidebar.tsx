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
import { useContext } from "react";
import { UserContext } from "@/UserContext";
import { useNavigate } from "react-router";

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
	const context = useContext(UserContext);
	const navigate = useNavigate();
	if (!context) {
		throw new Error("UserContext is null");
	}
	const { user, logout } = context;

	const handleLogout = () => {
		navigate("/");
		logout();
	};

	return (
		<Sidebar>
			<SidebarHeader>
				<img src="/logo.svg" alt="Logo" />
				<h1 className="text-2xl text-app-primary font-medium">{`Hello, ${user}!`}</h1>
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
									<a href="#">
										<LogOut />
										<span>Log out</span>
									</a>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarFooter>
		</Sidebar>
	);
}
