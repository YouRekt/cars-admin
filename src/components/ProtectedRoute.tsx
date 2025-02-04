import Cookies from "js-cookie";
import { Navigate, Outlet } from "react-router";

const ProtectedRoute = () => {
	const token = Cookies.get("administrator-token");

	return token ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
