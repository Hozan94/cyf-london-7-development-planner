import React from "react";
import "./SignUp.css";
import image from "../../img/cyf.png";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const userSchema = yup.object().shape({
	firstName: yup.string().required("First Name is required"),
	lastName: yup.string().required("Last Name is required"),
	city: yup.string().required(),
	class: yup.string().required(),
	email: yup.string().email("Email is not valid").required(),
	password: yup.string().min(8).max(15).required(),
	confirmPassword: yup
		.string()
		.oneOf([yup.ref("password"), null], "Passwords must match"),
});

function SignUp() {
	const handleClassMenu = (value) => {
		alert(value);
	};

	const handleRoleMenu = (value) => {
		alert(value);
	};

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(userSchema),
	});

	const onSubmit = (data) => {
		console.log(data);
		fetch("http://localhost:3000/api/graduates", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		})
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
			})
			.catch((error) => {
				console.error(error);
			});
	};

	return (
		<div>
			<div className="signUp-container">
				<img src={image} alt="cyf-logo" />
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="user-details">
						<div className="input-box">
							<span className="details">First Name</span>
							<input type="text" {...register("firstName")} />

							<p>{errors.firstName?.message}</p>
						</div>

						<div className="input-box">
							<span className="details">Last Name</span>
							<input type="text" {...register("lastName")} />

							<p>{errors.lastName?.message}</p>
						</div>

						<div className="input-box">
							<span className="details">Class</span>
							<select
								className="role"
								name="studentClass"
								id="studentClass"
								required
								{...register("class")}
								onChange={(e) => handleClassMenu(e.target.value)}
							>
								<option value="">--Please choose your Class--</option>
								<option value="WMS01">WMS01</option>
								<option value="WMS02">WMS02</option>
								<option value="LDN06">LDN06</option>
								<option value="LDN07">LDN07</option>
							</select>
						</div>

						<div className="input-box">
							<span className="details">Role</span>
							<select
								className="role"
								name="role"
								id="role"
								required
								{...register("role")}
								onChange={(e) => handleRoleMenu(e.target.value)}
							>
								<option value="">--Please choose your Role--</option>
								<option value="graduate">Graduate</option>
								<option value="mentor">Mentor</option>
							</select>
						</div>

						<div className="input-box">
							<span className="details">City</span>
							<input type="text" {...register("city")} />

							<p>{errors.city?.message}</p>
						</div>

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

						<div className="input-box">
							<span className="details">Confirm Password</span>
							<input type="password" {...register("confirmPassword")} />

							<p>{errors.confirmPassword?.message}</p>
						</div>
					</div>
					<div className="btn-holder">
						<button className="btn-signup">Signup</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default SignUp;

//import { useEffect, useState } from "react";
//import { Link } from "react-router-dom";

//import "./Home.css";
//import logo from "./logo.svg";

//export function Home() {
//	const [message, setMessage] = useState("Loading...");

//	useEffect(() => {
//		fetch("/api")
//			.then((res) => {
//				if (!res.ok) {
//					throw new Error(res.statusText);
//				}
//				return res.json();
//			})
//			.then((body) => {
//				setMessage(body.message);
//			})
//			.catch((err) => {
//				console.error(err);
//			});
//	}, []);

//	return (
//		<main role="main">
//			<div>
//				<img
//					className="logo"
//					data-qa="logo"
//					src={logo}
//					alt="Just the React logo"
//				/>
//				<h1 className="message" data-qa="message">
//					{message}
//				</h1>
//				<Link to="/about/this/site">About</Link>
//			</div>
//		</main>
//	);
//}

//export default Home;
