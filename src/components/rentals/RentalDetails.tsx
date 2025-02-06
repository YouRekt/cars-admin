import {
	MapPin,
	Fuel,
	Calendar,
	Users,
	DollarSign,
	XCircle,
	CheckCircle,
	DoorOpen,
	AtSign,
} from "lucide-react";
import { Rental } from "./columns";

const RentalInfo = ({ rental }: { rental: Rental }) => {
	const { car, customer, startAt, endAt, isCancelled } = rental;
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
				<DollarSign color="#004EEB" />
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
			<h3 className="text-lg text-accent-foreground font-semibold flex gap-2 items-center">
				<AtSign color="#004EEB" /> Customer
			</h3>
			<p className="text-accent-foreground flex gap-2">
				<span className="font-semibold">E-mail: </span>
				{customer.email}
			</p>
			<h3 className="text-lg text-accent-foreground font-semibold flex gap-2 items-center">
				<Calendar color="#004EEB" /> Rental Period
			</h3>
			<p className="text-accent-foreground flex gap-2">
				<span className="font-semibold">Start: </span>
				{new Intl.DateTimeFormat("pl-PL", {
					dateStyle: "short",
					timeStyle: "short",
					timeZone: "Europe/Warsaw",
				}).format(new Date(startAt as string))}
			</p>
			<p className="text-accent-foreground flex gap-2">
				<span className="font-semibold">End: </span>
				{new Intl.DateTimeFormat("pl-PL", {
					dateStyle: "short",
					timeStyle: "short",
					timeZone: "Europe/Warsaw",
				}).format(new Date(endAt as string))}
			</p>
			<h3 className="text-lg font-semibold mt-4 flex items-center">
				{isCancelled ? (
					<XCircle className="mr-2 text-app-error" />
				) : (
					<CheckCircle className="mr-2 text-app-success" />
				)}
				Status: {isCancelled ? "Cancelled" : "Active"}
			</h3>
		</div>
	);
};

export default RentalInfo;
