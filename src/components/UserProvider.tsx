import { getCustomerToken } from "@/lib/utils";
import { UserContext } from "@/UserContext";
import { useState, ReactNode } from "react";

const UserProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<string | null>(getCustomerToken()); // Initialize user state with the token from the cookie

	const login = (user: string) => setUser(user); // Function to update user state
	const logout = () => {
		setUser(null);
		// TODO: Clear the customer token cookie
	}; // Function to clear user state

	return (
		<UserContext.Provider value={{ user, login, logout }}>
			{children}
		</UserContext.Provider>
	);
};
export default UserProvider;
