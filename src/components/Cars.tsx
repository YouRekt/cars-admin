import { DataTable } from "./cars/data-table"
import SidebarButtonProvider from "./SidebarButtonProvider"
import { columns } from "./cars/columns"

const Cars = () => {
	return (
		<SidebarButtonProvider>
			<div className="container mx-auto py-10 px-4">
				<DataTable columns={columns} />
			</div>
		</SidebarButtonProvider>
	)
}

export default Cars;