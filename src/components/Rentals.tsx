import { DataTable } from "./rentals/data-table"
import { columns } from "./rentals/columns"

const Rentals = () => {
	return (
		<div className="container mx-auto py-10 px-4">
			<DataTable columns={columns} />
		</div>
	)
}

export default Rentals;