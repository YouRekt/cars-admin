import { createContext } from "react";

interface UserContextType {
	user: string | null;
	login: (user: string) => void;
	logout: () => void;
}

export const UserContext = createContext<UserContextType | null>(null);
