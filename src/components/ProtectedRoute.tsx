import useAuth from "@/hooks/use-auth";
import { Navigate, Outlet } from "react-router";

const ProtectedRoute = () => {
	const token = useAuth();

	return token ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
