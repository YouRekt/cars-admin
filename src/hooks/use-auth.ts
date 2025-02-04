import Cookies from "js-cookie";

const useAuth = () => {
	const token = Cookies.get("administrator-token");
	if (!token) {
		throw new Error("No token found");
	}
	const logout = () => {
		Cookies.remove("administrator-token");
		localStorage.removeItem("username");
	};

	return [token, logout];
};
export default useAuth;
