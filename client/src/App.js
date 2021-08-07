import React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();



import "bootstrap/dist/css/bootstrap.css";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import NavBar from "../../client/src/components/NavBar";
import SecureRoute from "../../client/src/components/SecureRoute";
import GraduateBoard from "../src/pages/GraduateBoard";
import "../src/pages/Home.css";
import Login from "../src/pages/Login/Login";
import MentorBoard from "../src/pages/MentorBoard";
import SignUp from "../src/pages/SignUp/SignUp";
import Welcome from "../src/pages/Welcome";



const App = () => {


    return (



  <div className="App">
  <header className="App-header">
      <Router>
          {/* <Link to="/signUp">Register</Link>
<br></br>
<Link to="/login">Log in</Link> */}
          {/*{!isAuthenticated ? <NavBar /> : null}*/}
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
      </Router>
      {/* <Login/> */}
  </header>
</div> 
     
    );
};

export default App;
