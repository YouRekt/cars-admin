import { DataTable } from "@/components/users/data-table";
import { columns } from "@/components/users/columns";

const Users = () => {
	return (
		<div className="container mx-auto py-10 px-4">
			<DataTable columns={columns} />
		</div>
	);
};

export default Users;
