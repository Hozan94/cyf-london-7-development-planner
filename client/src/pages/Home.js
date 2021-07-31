//import 'bootstrap/dist/css/bootstrap.css';
//import { Tabs, Tab, TabContainer, Container, Row, Col } from 'react-bootstrap';
//import SignUp from './SignUp/SignUp';
//import Login from './Login/Login';
//import "./Home.css";
//import React, { useState, useEffect } from 'react';
//import { toast } from 'react-toastify';
//import 'react-toastify/dist/ReactToastify.css';
//toast.configure();
import GraduateBoard from "./GraduateBoard";
import MentorBoard from "./MentorBoard";
import NavBar from "../components/NavBar";
import Welcome from "./Welcome";
import SignUp from "./SignUp/SignUp";
import Login from "./Login/Login";
import {
	BrowserRouter as Router,
	Link,
	Redirect,
	Switch,
	Route,
} from "react-router-dom";
import "./Home.css";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

function Home() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [role, setRole] = useState();

	const setAuth = (boolean) => {
		setIsAuthenticated(boolean);
	};

	const isAuth = async () => {
		try {
			const response = await fetch("http://localhost:3000/api/is-verify", {
				method: "GET",
				headers: {
					token: localStorage.token,
					role: setRole(localStorage.userType),
				},
			});

			const parseRes = await response.json(); //res is true if verified
			parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false);
		} catch (err) {
			console.error(err.message);
		}
	};

	useEffect(() => {
		isAuth();
	}, [isAuthenticated]);

	return (
		<div className="App">
			<header className="App-header">
				<Router>
					{/* <Link to="/signUp">Register</Link>
					<br></br>
					<Link to="/login">Log in</Link> */}
					<NavBar />
					<>
						<Switch>
							<Route
                                exact
                                path="/welcome"
                                render={() => <Welcome />}

							/>
							<Route
								exact
								path="/login"
								render={(props) =>
									!isAuthenticated ? (
										<Login {...props} setAuth={setAuth} userType={setRole} />
									) : (
										<Redirect to={`/dashboard/${role}`} />
									)
								}
							/>

							<Route
								exact
								path="/signup"
								render={(props) =>
									!isAuthenticated ? (
										<SignUp {...props} setAuth={setAuth} userType={setRole} />
									) : (
										<Redirect to="/login" />
									)
								}
							/>

							<Route
								exact
								path={"/dashboard/graduate"}
								render={(props) =>
									isAuthenticated ? (
										<GraduateBoard {...props} setAuth={setAuth} />
									) : (
										<Redirect to="/login" />
									)
								}
							/>
							<Route
								exact
								path={"/dashboard/mentor"}
								render={(props) =>
									isAuthenticated ? (
										<MentorBoard {...props} setAuth={setAuth} />
									) : (
										<Redirect to="/login" />
									)
								}
							/>
						</Switch>
					</>
				</Router>

				{/* <Login/> */}
			</header>
		</div>
	);
}

//const [isAuthenticated, setIsAuthenticated] = useState(false);

//const setAuth = (boolean) => {
//    setIsAuthenticated(boolean);
//}

//const isAuth = async () => {
//    try {

//        const response = await fetch("http://localhost:3000/auth/is-verify", {
//            method: "GET",
//            headers: { token: localStorage.token }
//        });

//        const parseRes = await response.json();
//        parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false);
//    } catch (err) {
//        console.error(err.message);
//    }
//}

//useEffect(() => {
//    isAuth()
//}, [])

//return (
//    <Container>
//        <Row>
//            <Col md={{ span: 4, offset: 4 }}>
//                <Tabs defaultActiveKey="SignUp" id="uncontrolled-tab-example" className="mb-3 tabs-container">
//                    <Tab eventKey="signUp" title="Signup" tabClassName="tab">
//                        {!isAuthenticated ?
//                            <SignUp setAuth={setAuth} />
//                            :
//                            <Redirect to="/login" />

//                        }
//                        {/*<SignUp />*/}
//                    </Tab>
//                    <Tab eventKey="login" title="Login" tabClassName="tab">
//                        {!isAuthenticated ?
//                            <Login setAuth={setAuth} />
//                            :
//                            <Redirect to="/dashboard" />

//                        }
//                        {/*<Login />*/}

//                    </Tab>
//                </Tabs>
//            </Col>
//        </Row>
//    </Container>
//);

export default Home;
