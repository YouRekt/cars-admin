import Cookies from "js-cookie";
import { useNavigate } from "react-router";

const useAuth: () => [string, () => void, string] = () => {
	const navigate = useNavigate();
	const token = Cookies.get("administrator-token");

	const logout = () => {
		Cookies.remove("administrator-token");
		localStorage.removeItem("username");
	};
	const username = localStorage.getItem("username");
	if (!username || !token) {
		navigate("/", { replace: true });
		return ["", () => {}, ""];
	}

	return [token, logout, username];
};
export default useAuth;
