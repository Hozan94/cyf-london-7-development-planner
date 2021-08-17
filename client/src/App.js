<<<<<<< HEAD
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import NavBar from "./components/NavBar";
import SecureRoute from "./components/SecureRoute";
import GraduateBoard from "./pages/GraduateBoard";
import Login from "./pages/Login/Login";
import MentorBoard from "./pages/MentorBoard";
import SignUp from "./pages/SignUp/SignUp";
import Welcome from "./pages/Welcome";
import Footer from "./components/Footer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

const App = () => {
    return (

        <Router>
            <Switch>
                <NavBar />
            </Switch>
            <>
                <Switch>
                    <Route exact path="/" render={() => <Welcome />} />
                    <Route exact path="/welcome" render={() => <Welcome />} />
                    <Route exact path="/login" render={() => <Login />} />
                    {/* <Route component={ErrorMessage}/> */}
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
            <Switch>
                <Footer />
            </Switch>
        </Router>
    );
};
=======
import { Route, Switch } from "react-router-dom";

import About from "./pages/About";
import Home from "./pages/Home";

const App = () => (
	<Switch>
		<Route path="/" exact>
			<Home />
		</Route>
		<Route path="/about/this/site">
			<About />
		</Route>
	</Switch>
);
>>>>>>> da79074b2f1c86687da126fe3c89261f123fc3d0

export default App;
