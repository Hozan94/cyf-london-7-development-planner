import React, { useState, useEffect } from "react";
import "./SignUp.css";
import image from "../../img/cyf.png";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { Form } from "../../components/useForm";
import { FormControl, InputLabel, MenuItem, Select as MuiSelect, makeStyles, Grid, TextField, Paper } from '@material-ui/core';

const userSchema = yup.object().shape({
    firstName: yup.string().required("First Name is required"),
    lastName: yup.string().required("Last Name is required"),
    city: yup.string().required("Please Select your city"),
    classCode: yup.string(),
    email: yup.string().email("Email is not valid").required("Email is required"),
    password: yup.string().min(8).max(20).required("Password is required"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password"), null], "Passwords must match"),
});

const SignUp = ({ userType }) => {
    const history = useHistory();
    const [status, setStatus] = useState(true);
    const [role, setRole] = useState("");
    const [cities, setCities] = useState([]);
    const [classes, setClasses] = useState([]);

    //new
    const [studentClass, setStudentClass] = useState("");
    const [city, setCity] = useState("");

    //const handleClassMenu = (value) => {
    //    console.log(value);
    //};

    //const handleRoleMenu = (value) => {
    //    value === "graduate" ? setStatus(false) : setStatus(true);
    //    setRole(value);
    //    userType(value);
    //    console.log(value);
    //};

    // bind usefrom and yup with yupresolver
    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(userSchema) });

    const getCities = async () => {
        try {
            const response = await fetch("/api/cities");

            const cities = await response.json();
            setCities(cities);

        } catch (err) {
            console.log(err.message);
        }
    };

    const getClasses = async () => {
        try {
            const response = await fetch("/api/classes");

            const classes = await response.json();
            setClasses(classes);

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

    const onRoleChange = (e) => {
        e.target.value === "graduate" ? setStatus(false) : setStatus(true);
        setRole(e.target.value)
        //userType=e.target.value;
        console.log(e.target.value);
    }

    const onClassChange = (e) => {
        setStudentClass(e.target.value)
    }
    const onCityChange = (e) => {
        setCity(e.target.value)
    }
    console.log(studentClass)

    return (
        <div className="form-container">
            <Paper className="paper-wrapper">
                <div className="signup-img">
                    <img src={image} alt="cyf-logo" />
                </div>
                <Form onSubmit={handleSubmit(onSubmitForm)}>
                    <Grid container justifyContent="space-around">
                        <Grid container item xs={6} justifyContent="center">
                            <TextField
                                error={errors.firstName?.message ? true : false}
                                variant="outlined"
                                label="First Name"
                                name="firstName"
                                helperText={errors.firstName?.message}
                                {...register("firstName")}
                            />
                        </Grid>
                        <Grid container item xs={6} justifyContent="center">
                            <TextField
                                error={errors.lastName?.message ? true : false}
                                variant="outlined"
                                label="Last Name"
                                name="lastName"
                                helperText={errors.lastName?.message}
                                {...register("lastName")}
                            />
                        </Grid>
                        <Grid container item xs={6} justifyContent="center">
                            <FormControl variant="outlined">
                                <InputLabel>Role</InputLabel>
                                <MuiSelect
                                    label="role"
                                    name="role"
                                    value={role}
                                    required
                                    onChange={onRoleChange}
                                >
                                    <MenuItem value=""><em>None</em></MenuItem>
                                    <MenuItem value="graduate">Graduate</MenuItem>
                                    <MenuItem value="mentor">Mentor</MenuItem>
                                </MuiSelect>
                            </FormControl>
                        </Grid>
                        <Grid container item xs={6} justifyContent="center">
                            <FormControl variant="outlined">
                                <InputLabel>Class <span className="grads-only-msg">(Graduates Only)</span></InputLabel>
                                <MuiSelect
                                    label="Class"
                                    name="class"
                                    disabled={status}
                                    required={!status ? true : false}
                                    value={studentClass}
                                    {...register("classCode")}
                                    onChange={onClassChange}
                                >
                                    <MenuItem value=""><em>None</em></MenuItem>
                                    {classes.map((item) => (
                                        <MenuItem key={item.class_code} value={item.class_code}>{item.class_code}</MenuItem>
                                    ))}
                                </MuiSelect>
                            </FormControl>
                        </Grid>
                        <Grid container item xs={6} justifyContent="center">
                            <FormControl variant="outlined">
                                <InputLabel>City</InputLabel>
                                <MuiSelect
                                    label="City"
                                    name="city"
                                    value={city}
                                    required
                                    {...register("city")}
                                    onChange={onCityChange}
                                >
                                    <MenuItem value=""><em>None</em></MenuItem>
                                    {cities.map((item) => (
                                        <MenuItem key={item.city_name} value={item.city_name}>{item.city_name}</MenuItem>
                                    ))}
                                </MuiSelect>
                            </FormControl>
                        </Grid>
                        <Grid container item xs={6} justifyContent="center">
                            <TextField
                                error={errors.email?.message ? true : false}
                                variant="outlined"
                                label="Email"
                                name="email"
                                helperText={errors.email?.message}
                                {...register("email")}
                            />
                        </Grid>
                        <Grid container item xs={6} justifyContent="center">
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
                        <Grid container item xs={6} justifyContent="center">
                            <TextField
                                error={errors.confirmPassword?.message ? true : false}
                                variant="outlined"
                                label="Confirm Password"
                                name="confirmPassword"
                                type="password"
                                helperText={errors.confirmPassword?.message}
                                {...register("confirmPassword")}
                            />
                        </Grid>
                        <Grid container item xs={7} justifyContent="center">
                            <div className="btn-holder">
                                <button type="submit" className="btn-signup">Sign up</button>
                            </div>
                        </Grid>
                    </Grid>
                </Form>
            </Paper>
        </div>
    );
};

export default SignUp;


       