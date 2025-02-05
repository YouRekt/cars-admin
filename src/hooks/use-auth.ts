import Cookies from "js-cookie";

const useAuth: () => [string, () => void, string] = () => {
	const token = Cookies.get("administrator-token");
	if (!token) {
		throw new Error("No token found");
	}
	const logout = () => {
		Cookies.remove("administrator-token");
		localStorage.removeItem("username");
	};
	const username = localStorage.getItem("username");
	if (!username) {
		throw new Error("No username found");
	}

	return [token, logout, username];
};
export default useAuth;
