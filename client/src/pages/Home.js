import 'bootstrap/dist/css/bootstrap.css';
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

import SignUp from './SignUp/SignUp';
import Login from './Login/Login';
import {
    BrowserRouter as Router,
    Redirect,
    Switch,
    Route
} from 'react-router-dom';
import './Home.css';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure();

function Home() {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState();

    const setAuth = (boolean) => {
        setIsAuthenticated(boolean);
    }

    const isAuth = async () => {
        try {

            const response = await fetch("http://localhost:3000/api/is-verify", {
                method: "GET",
                headers: { token: localStorage.token, role : setRole(localStorage.userType) }
            });


            const parseRes = await response.json();
            parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false);
        } catch (err) {
            console.error(err.message);
        }
    }

    useEffect(() => {
        isAuth()
    }, [])

    return (
        <div className="App">
            <header className="App-header">
                <Router>
                    <Switch>
                        <Route exact path="/login" render={props => !isAuthenticated ?
                            <Login  {...props} setAuth={setAuth} userType={setRole}/>
                            :
                            <Redirect to={`/dashboard/${role}` }/>

                        } />

                        <Route exact path="/signup" render={props => !isAuthenticated ?
                            <SignUp {...props} setAuth={setAuth} userType={setRole} />
                            :
                            <Redirect to="/login" />

                        } />

                        <Route exact path={`/dashboard/${role}`} render={props => isAuthenticated ?
                           ( role === "graduate" ? < GraduateBoard {...props} setAuth={setAuth} />
                                : < MentorBoard {...props} setAuth={setAuth} /> )
                            :
                            <Redirect to="/login" />

                        } />

                    </Switch>
                </Router>

                {/* <Login/> */}


            </header>
        </div>
    );
}

export default Home;
