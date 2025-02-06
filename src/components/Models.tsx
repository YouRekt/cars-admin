import { columns } from "@/components/models/columns";
import { DataTable } from "@/components/models/data-table";

const Models = () => {
	return (
		<div className="container mx-auto py-10 px-4">
			<DataTable columns={columns} />
		</div>
	);
};
export default Models;
