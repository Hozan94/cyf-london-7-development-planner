import React from "react";
import { Route, Redirect } from "react-router-dom";
const SecureRoute = (props) => {
	const isCorrectRole = localStorage.getItem("userType") === props.allowedRole;
	const hasToken = !!localStorage.getItem("token");
	if (isCorrectRole && hasToken) {
		return <Route {...props} />;
	}
	return <Redirect to="/login" />;
};
export default SecureRoute;