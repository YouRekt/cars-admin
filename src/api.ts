export const login = async (
	username: string,
	password: string
): Promise<boolean> => {
	const response = await fetch("/session", {
		method: "PUT",
		headers: {
			Authorization: `Basic ${btoa(`${username}:${password}`)}`,
		},
		credentials: "include",
	});
	return response.status === 204;
};

export const register = async (
	email: string,
	username: string,
	password: string
): Promise<boolean> => {
	const formData = new FormData();
	formData.append("email", email);
	formData.append("username", username);
	formData.append("password", password);

	const response = await fetch("/customer", {
		method: "POST",
		body: formData,
		credentials: "include",
	});
	return response.status === 204;
};
