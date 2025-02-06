import { MapPin, Car as CarIcon, Fuel, Calendar, Users, DollarSign, Mail, XCircle, CheckCircle } from "lucide-react";
import { Rental } from "./columns"

const RentalInfo = ({ rental }: { rental: Rental }) => {

    const { car, customer, startAt, endAt, isCancelled } = rental;
    const { model, location, imageUrl } = car;

    return (

        <div className="p-4">
            {imageUrl && (
                <img
                    src={imageUrl}
                    alt={`${model.brandName} ${model.name}`}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                />
            )}
            <h2 className="text-xl font-bold mb-2 flex items-center">
                <CarIcon className="mr-2" /> {model.brandName} - {model.name}
            </h2>
            <p className="text-gray-700 flex items-center">
                <Calendar className="mr-2" /> Year: {model.productionYear}
            </p>
            <p className="text-gray-700 flex items-center">
                <Fuel className="mr-2" /> Fuel: {model.fuelType} ({model.fuelCapacity}L)
            </p>
            <p className="text-gray-700 flex items-center">
                <Users className="mr-2" /> Seats: {model.seatCount} | Doors: {model.doorCount}
            </p>
            <p className="text-gray-700 flex items-center">
                <DollarSign className="mr-2" /> Daily Rate: ${model.dailyRate.toFixed(2)}
            </p>
            <h3 className="text-lg font-semibold mt-4 flex items-center">
                <MapPin className="mr-2" /> Location
            </h3>
            <p className="text-gray-700">{location.fullAddress}</p>
            <p className="text-gray-700">Lat: {location.latitude}, Long: {location.longitude}</p>
            <h3 className="text-lg font-semibold mt-4 flex items-center">
                <Mail className="mr-2" /> Customer
            </h3>
            <p className="text-gray-700">{customer.email}</p>
            <h3 className="text-lg font-semibold mt-4 flex items-center">
                <Calendar className="mr-2" /> Rental Period
            </h3>
            <p className="text-gray-700">Start: {startAt ? new Date(startAt).toLocaleString() : "N/A"}</p>
            <p className="text-gray-700">End: {endAt ? new Date(endAt).toLocaleString() : "N/A"}</p>
            <h3 className="text-lg font-semibold mt-4 flex items-center">
                {isCancelled ? <XCircle className="mr-2 text-red-500" /> : <CheckCircle className="mr-2 text-green-500" />}
                Status: {isCancelled ? "Cancelled" : "Active"}
            </h3>
        </div>

    );
};

export default RentalInfo;
