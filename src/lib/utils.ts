import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const getCookies = (name: string) => {
	const cookies = document.cookie
		.split("; ")
		.find((row) => row.startsWith(`${name}=`));

	return cookies ? cookies.split("=")[1] : null;
};

export const getCustomerToken = () => getCookies("customer-token");
