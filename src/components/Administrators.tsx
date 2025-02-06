import { columns } from "@/components/administrators/columns";
import { DataTable } from "@/components/administrators/data-table";

const Administrators = () => {
	return (
		<div className="container mx-auto py-10 px-4">
			<DataTable columns={columns} />
		</div>
	);
};
export default Administrators;
