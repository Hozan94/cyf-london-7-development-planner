import React, { useState, useEffect } from 'react';
import { Route, Switch } from "react-router-dom";
import About from "./pages/About";
import Home from "./pages/Home";
import GraduateBoard from "./pages/GraduateBoard";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure();
//here I made some comment
//This is also Hozan comment

const App = () => {


    return (

        <Home/>
        //<Switch>
        //    <Route path="/" exact>
        //        <Home />
        //    </Route>
        //    <Route path="/about/this/site">
        //        <About />
        //    </Route>
        //    <Route path="/graduate/board">
        //        {/* we need to make this a protected path on the front end */}
        //        <GraduateBoard />
        //    </Route>
        //</Switch>
    )
};

export default App;
