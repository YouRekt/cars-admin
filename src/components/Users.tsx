import { DataTable } from "@/components/users/data-table";
import SidebarButtonProvider from "@/components/SidebarButtonProvider";
import { columns } from "@/components/users/columns";

const Users = () => {
	return (
		<SidebarButtonProvider>
			<div className="container mx-auto py-10 px-4">
				<DataTable columns={columns} />
			</div>
		</SidebarButtonProvider>
	);
};

export default Users;
