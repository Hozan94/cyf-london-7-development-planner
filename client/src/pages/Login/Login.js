import React from "react";
import "./Login.css";
import image from "../../img/cyf.png";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
 import * as yup from "yup";


 const loginSchema = yup.object().shape({
    email: yup.string().email("Email is not valid").required(),
    password: yup.string().required(),

});


function Login() {

    const { register, handleSubmit, formState:{ errors } } = useForm({
        resolver: yupResolver(loginSchema),
      });

      const onSubmit = (data) => console.log(data);

      return (
        <div>

            <div className="Login-container">
              <img src={image} alt="Write something here" />
               <form onSubmit={handleSubmit(onSubmit)}>
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
    );
}

export default Login;
