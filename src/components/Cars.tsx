import { DataTable } from "./cars/data-table"
import { columns } from "./cars/columns"

const Cars = () => {
	return (
			<div className="container mx-auto py-10 px-4">
				<DataTable columns={columns} />
			</div>
	)
}

export default Cars;
