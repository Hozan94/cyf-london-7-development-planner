import React, { useState, useEffect } from "react";
import "./SignUp.css";
import image from "../../img/cyf.png";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";

const userSchema = yup.object().shape({
	firstName: yup.string().required("First Name is required"),
	lastName: yup.string().required("Last Name is required"),
	city: yup.string().required(),
	classCode: yup.string(),
	email: yup.string().email("Email is not valid").required(),
	password: yup.string().min(8).max(20).required(),
	confirmPassword: yup
		.string()
		.oneOf([yup.ref("password"), null], "Passwords must match"),
});

const SignUp = ({ userType }) => {
	const history = useHistory();
	const [role, setRole] = useState("");
	const [status, setStatus] = useState(true);
	const [cities, setCities] = useState([]);
    const [classes, setClasses] = useState([]);
	const handleClassMenu = (value) => {
		console.log(value);
	};

	const handleRoleMenu = (value) => {
		value === "graduate" ? setStatus(false) : setStatus(true);
		setRole(value);
		userType(value);
		console.log(value);
	};

	// bind usefrom and yup with yupresolver
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(userSchema),
	});

	const getCities = async () => {
		try {
			const response = await fetch("/api/cities");
			const cities = await response.json();
			setCities(cities);
			console.log(cities);
		} catch (err) {
			console.log(err.message);
		}
	};

    const getClasses = async () => {
		try {
			const response = await fetch("/api/classes");
			const classes = await response.json();
			setClasses(classes);
			console.log(classes);
		} catch (err) {
			console.log(err.message);
		}
	};
	useEffect(() => {
		getCities();
        getClasses();

	}, []);

	const onSubmitForm = async (data) => {
		try {
			const response = await fetch(`/api/register/${role}s`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			const parseRes = await response.json();
			if (parseRes.token) {
				localStorage.setItem("token", parseRes.token);
				localStorage.setItem("userType", role);
				history.push(`/dashboard/${role}`);
				toast.success("You Registered Successfully");
			} else {
				toast.error(parseRes);
			}
		} catch (err) {
			console.error(err.message);
		}
	};

	return (
		<div>
			<div className="signUp-container">
				<img src={image} alt="cyf-logo" />
				<form onSubmit={handleSubmit(onSubmitForm)}>
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
							<span className="details">Class</span>
							<select
								className="role"
								name="studentClass"
								id="studentClass"
								required
								{...register("classCode")}
								onChange={(e) => handleClassMenu(e.target.value)}
								disabled={status}
							>
								<option value="">--Please choose your Class--</option>
								{classes.map((item) => (
                                    <option key={item.id }value={item.class_code}>{item.class_code}</option>
								))}
							</select>
						</div>

						<div className="input-box">
							<span className="details">City</span>
							{/* <input type="text"   {...register("city")} /> */}
							<select
								className="city"
								{...register("city")}
								required
								onChange={(e) => handleCityMenu(e.target.value)}
							>
								<option value="">--Please choose your city--</option>
								{cities.map((elem) => (
									<option key={elem.id} value={elem.city_name}>
										{elem.city_name}
									</option>
								))}
								{/* <option value="WMS01">WMS01</option> */}
							</select>

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
};

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
