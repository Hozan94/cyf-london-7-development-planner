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
            <Switch>
                <Footer />
            </Switch>
        </Router>
    );
};

export default App;
