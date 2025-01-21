import { UserContext } from "@/UserContext";
import { useContext } from "react";
import { Navigate } from "react-router";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
	const userContext = useContext(UserContext);
	const user = userContext ? userContext.user : null;

	if (!user) {
		return <Navigate to="/unauthorized" replace />;
	}

	return children;
};

export default ProtectedRoute;
