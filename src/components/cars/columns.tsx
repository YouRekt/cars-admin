"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Edit, Trash } from "lucide-react";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import EditCarForm from "./EditCarForm";

export type Model = {
    id: string
    brandName: string
    name: string
    productionYear: number
    fuelType: string
    fuelCapacity: number
    seatCount: number
    doorCount: number
    dailyRate: number
}

export type Location = {
    id: string
    fullAddress: string
    latitude: number
    longitude: number
}

export type Car = {
    id: string
    model: Model
    location: Location
    imageUrl: string
    imageId: string
}

export const columns = (
    handleDelete: (id: string) => void,
    setCarAdded: (next: boolean) => void
): ColumnDef<Car>[] => [
        {
            accessorKey: "id",
            header: "ID",
            cell: ({ row }) => {
                const id: string = row.getValue("id");

                return (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span
                                    onClick={() =>
                                        navigator.clipboard.writeText(id)
                                    }
                                    className="font-mono border rounded-md p-1"
                                >
                                    {id}
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Click to copy car ID</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                );
            },
        },
        {
            accessorKey: "model",
            header: "Model",
            cell: ({ row }) => {
                const model: Model = row.getValue("model")
                const modelName: string = model.name;

                return (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span
                                    onClick={() =>
                                        navigator.clipboard.writeText(modelName)
                                    }
                                >
                                    {modelName}
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Click to copy car model name</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                );
            },


        },
        {
            accessorKey: "location",
            header: "Location",
            cell: ({ row }) => {
                const location: Location = row.getValue("location")
                const locationCity: string = location.fullAddress.substring(location.fullAddress.indexOf(",") + 2, location.fullAddress.indexOf(",", location.fullAddress.indexOf(",") + 1))

                return (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span
                                    onClick={() =>
                                        navigator.clipboard.writeText(locationCity)
                                    }
                                >
                                    {locationCity}
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Click to copy the city</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                );
            }
        },
        {
            accessorKey: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const id: string = row.getValue("id");
                const model: Model = row.getValue("model")
                const modelId: string = model.id;
                const location: Location = row.getValue("location");
                const locationId: string = location.id;
                const imageId: string = row.original.imageId;

                return (
                    <div className="flex gap-4">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button size="icon" variant="outline">
                                    <Edit />
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Edit Car{" "}
                                        <span className="font-mono border rounded-md p-1">
                                            {id}
                                        </span>
                                    </DialogTitle>
                                </DialogHeader>
                                <EditCarForm
                                    setCarAdded={setCarAdded}
                                    modelId={modelId}
                                    locationId={locationId}
                                    imageId={imageId}
                                />
                            </DialogContent>
                        </Dialog>
                        <Button
                            size="icon"
                            variant="destructive"
                            onClick={() => handleDelete(id)}
                        >
                            <Trash />
                        </Button>
                    </div>
                )
            }
        },
    ]
