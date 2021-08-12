import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";
import { toast } from "react-toastify";
import * as yup from "yup";
import image from "../../img/cyf.png";
import "./Login.css";
import { Form } from "../../components/useForm";
import { Grid, TextField, Paper } from '@material-ui/core';


const loginSchema = yup.object().shape({
    email: yup.string().email("Email is not valid").required(),
    password: yup.string().required(),
});

const Login = () => {

    const [errorMessage, setErrorMessage] = useState();
    const history = useHistory();

    const { register, handleSubmit, setError, formState: { errors } } = useForm({ resolver: yupResolver(loginSchema) });

    const onSubmitForm = async (data) => {

        try {
            const response = await fetch("/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const parseRes = await response.json();
            setErrorMessage(parseRes.error);

            if (parseRes.token) {
                localStorage.setItem("token", parseRes.token);
                localStorage.setItem("userType", parseRes.userType); //On refresh this will make sure the userType stays in local storage, so when it re-render we get the correct dashboard

                history.push(`/dashboard/${parseRes.userType}`);
                toast.success(" login was Successful");
            } else {
                toast.error(parseRes);
                alert(parseRes.error);
                setErrorMessage(parseRes.error);
            }

        } catch (err) {
            console.error(err.message);
        }
    };

    return (
        <div className="login-form-container">
            <Paper className="login-paper-wrapper">
                <div className="login-img">
                    <img src={image} alt="cyf-logo" />
                </div>
                <Form onSubmit={handleSubmit(onSubmitForm)}>
                    <Grid container direction="column" justifyContent="space-around" alignContent="center">
                        <Grid container item xs={12} justifyContent="center">
                            <TextField
                                error={errors.email?.message ? true : false}
                                variant="outlined"
                                label="Email"
                                name="email"
                                type="email"
                                helperText={errors.email?.message}
                                {...register("email")}
                            />
                        </Grid>
                        <Grid container item xs={12} justifyContent="center">
                            <TextField
                                error={errors.password?.message ? true : false}
                                variant="outlined"
                                label="Password"
                                name="password"
                                type="password"
                                helperText={errors.password?.message}
                                {...register("password")}
                            />
                        </Grid>
                        <Grid container item xs={12} justifyContent="center">
                            <div className="login-btn-holder">
                                <button type="submit" className="btn-login">Log in</button>
                            </div>
                        </Grid>
                    </Grid>
                </Form>
            </Paper>
        </div>
    );
};

export default Login;

{/*//<div>
		//	<div className="login-container">
		//		<img src={image} alt="Write something here" />
		//		<form onSubmit={handleSubmit(onSubmitForm)}>
		//			<div className="login-details">
		//				<div className="input-box">
		//					<span className="details">Email</span>
		//					<input type="email" {...register("email")} />
		//					<p>{errors.email?.message}</p>
		//				</div>
		//				<div className="input-box">
		//					<span className="details">Password</span>
		//					<input type="password" {...register("password")} />
		//					<p>{errors.password?.message}</p>
		//				</div>
		//			</div>
		//			<div className="btn-holder">
		//				<button className="btn-login">Login</button>
		//			</div>
		//		</form>
		//	</div>
		//</div>*/}