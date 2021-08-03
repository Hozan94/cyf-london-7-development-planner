import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";
import { toast } from "react-toastify";
import * as yup from "yup";
import image from "../../img/cyf.png";
import "./Login.css";
const loginSchema = yup.object().shape({
	email: yup.string().email("Email is not valid").required(),
	password: yup.string().required(),
});
const Login = () => {
	const history = useHistory();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(loginSchema),
	});
	const onSubmitForm = async (data) => {
		try {
			const response = await fetch("/api/users/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			const parseRes = await response.json();
			if (parseRes.token) {
				localStorage.setItem("token", parseRes.token);
				localStorage.setItem("userType", parseRes.userType); //On refresh this will make sure the userType stays in local storage, so when it re-render we get the correct dashboard
				history.push(`/dashboard/${parseRes.userType}`);
				toast.success(" login was Successful");
			} else {
				toast.error(parseRes);
			}
		} catch (err) {
			console.error(err.message);
		}
	};
	return (
		<div>
			<div className="Login-container">
				<img src={image} alt="Write something here" />
				<form onSubmit={handleSubmit(onSubmitForm)}>
					<div className="Login-details">
						<div className="input-box">
							<span className="details">Email</span>
							<input type="email" {...register("email")} />
							<p>{errors.email?.message}</p>
						</div>
						<div className="input-box">
							<span className="details">Password</span>
							<input type="password" {...register("password")} />
							<p>{errors.password?.message}</p>
						</div>
					</div>
					<div className="btn-holder">
						<button className="btn-login">Login</button>
					</div>
				</form>
			</div>
		</div>
	);
};
export default Login;