import React from "react";
import './Welcome.css';
import image from "../img/CodeYourFuture2.jpeg";

function Welcome() {

    return (
        <div className="main">
            <div className="image-wrapper">
                <img className="cyf-image" src={image} alt="cyf" />
            </div>
            <div className="title">
                <h1><span className="title-txt">Development</span><br /> Planner</h1>
                <p className="txt-slogen">If you’re looking for a holistic  app that covers tasks,<br /> routines, goals and habits, try Development Planner</p>
            </div>
        </div>
    );
}

export default Welcome;
