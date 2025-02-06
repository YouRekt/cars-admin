import {
	Calendar,
	DollarSign,
	DoorOpen,
	Fuel,
	MapPin,
	Users,
} from "lucide-react";
import { Car as CarType } from "./columns";

const CarDetails = ({ car }: { car: CarType }) => {
	const { model, location, imageUrl } = car;

	return (
		<div className="p-4 flex flex-col gap-4">
			{imageUrl && (
				<img
					src={imageUrl}
					alt={`${model.brandName} ${model.name}`}
					className="w-full h-48 object-cover rounded-lg mb-4"
				/>
			)}
			<h2 className="text-xl font-bold mb-2 flex items-center">
				{`${model.brandName} - ${model.name}`}
			</h2>
			<p className="text-accent-foreground flex gap-2">
				<Calendar color="#004EEB" />{" "}
				<span className="font-semibold">Production Year: </span>{" "}
				{`${model.productionYear}`}
			</p>
			<p className="text-accent-foreground flex gap-2">
				<Fuel color="#004EEB" />{" "}
				<span className="font-semibold">Fuel Type:</span>
				{`${model.fuelType} (Capactity: ${model.fuelCapacity} L)`}
			</p>
			<p className="text-accent-foreground flex gap-2">
				<Users color="#004EEB" />
				<span className="font-semibold">Seats:</span> {model.seatCount}
			</p>
			<p className="text-accent-foreground flex gap-2">
				<DoorOpen color="#004EEB" />{" "}
				<span className="font-semibold">Doors: </span>
				{model.doorCount}
			</p>
			<p className="text-accent-foreground flex gap-2">
				<DollarSign color="#004EEB" />{" "}
				<span className="font-semibold">Daily Rate: </span>
				{new Intl.NumberFormat("pl-PL", {
					style: "currency",
					currency: "PLN",
				}).format(model.dailyRate)}
			</p>
			<h3 className="text-lg text-accent-foreground font-semibold flex gap-2 items-center">
				<MapPin color="#004EEB" /> Location
			</h3>
			<p className="text-accent-foreground">{location.fullAddress}</p>
			<p className="text-accent-foreground">
				<span className="font-semibold">Latitude: </span>
				{location.latitude},{" "}
				<span className="font-semibold">Longitude:</span>{" "}
				{location.longitude}
			</p>
		</div>
	);
};

export default CarDetails;
