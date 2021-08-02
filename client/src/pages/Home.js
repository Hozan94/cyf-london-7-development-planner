
import "bootstrap/dist/css/bootstrap.css";
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavBar from "../components/NavBar";
import SecureRoute from "../components/SecureRoute";
import GraduateBoard from "./GraduateBoard";
import "./Home.css";
import Login from "./Login/Login";
import MentorBoard from "./MentorBoard";
import SignUp from "./SignUp/SignUp";
import Welcome from "./Welcome";
toast.configure();
function Home() {
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
							<Route exact path="/welcome" render={() => <Welcome />} />
							<Route exact path="/login" render={() => <Login />} />
							<Route exact path="/signup" render={() => <SignUp />} />
							<SecureRoute
								exact
								path="/dashboard/graduate/"
								render={() => <GraduateBoard />}
								allowedRole="graduate"
							/>
							<SecureRoute
								exact
								path="/dashboard/mentor"
								render={() => <MentorBoard />}
								allowedRole="mentor"
							/>
						</Switch>
					</>
				</Router>
				{/* <Login/> */}
			</header>
		</div>
	);
}
export default Home;