import Cookies from "js-cookie";
import { useEffect } from "react";
import { useNavigate } from "react-router";

const useAuth: () => [string, () => void, string] = () => {
	const navigate = useNavigate();
	const token = Cookies.get("administrator-token");

	const logout = () => {
		Cookies.remove("administrator-token");
		localStorage.removeItem("username");
	};
	const username = localStorage.getItem("username");
	useEffect(() => {
		if (!username || !token) {
			navigate("/", { replace: true });
		}
	}, [navigate, token, username]);
	if (!username || !token) {
		return ["", () => {}, ""];
	}

	return [token, logout, username];
};
export default useAuth;
