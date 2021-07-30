import React, { useState } from 'react'
import "./Login.css";
import image from '../../img/cyf.png';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";



const loginSchema = yup.object().shape({
    email: yup.string().email("Email is not valid").required(),
    password: yup.string().required(),

});


//function Login() {

//    const { register, handleSubmit, formState: { errors } } = useForm({
//        resolver: yupResolver(loginSchema)
//    });

//    const onSubmit = data => console.log(data);


const Login = ({ setAuth, userType }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(loginSchema)
    });

    //const [role, setRole] = useState("");

    const onSubmitForm = async (data) => {

        try {
            const response = await fetch("http://localhost:3000/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            const parseRes = await response.json();
            //console.log(parseRes.email)
            userType(parseRes.userType)

            if (parseRes.token) {
                localStorage.setItem("token", parseRes.token)
                localStorage.setItem("userType", parseRes.userType)

                setAuth(true);
                toast.success(" login was Successfull");
            } else {
                setAuth(false);
                toast.error(parseRes);

            }

        } catch (err) {
            console.error(err.message);
        }

    }
    return (
        <div>

            <div className="Login-container">
                <img src={image} alt="Write something here" />
                <form onSubmit={handleSubmit(onSubmitForm)}>
                    <div className="Login-details">

                        <div className="input-box">
                            <span className="details">Email</span>
                            <input type="email"   {...register("email")} />
                            <p>{errors.email?.message}</p>
                        </div>


                        <div className="input-box">
                            <span className="details">Password</span>
                            <input type="password"   {...register("password")} />
                            <p>{errors.password?.message}</p>
                        </div>
                    </div>
                    <div className="btn-holder">
                        <button className="btn-login">Login</button>
                    </div>

                </form>

            </div>
        </div>
    )
}

export default Login
