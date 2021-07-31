import React, { useState, useEffect } from 'react';
import './Dashboards.css';
import Test from '../components/Test'
import Controls from '../components/controls/Controls';
import { toast } from "react-toastify";



function MentorBoard({ setAuth }) {

    const fakeData = [
        {
            graduateName: "Hozan Ali",
            requestDate: "20/05/2021",
            planName: "Make a website about your products and add the option of purchase",
            goalsList: [
                {
                    goalDetails: "Create the Front End",
                    dueDate: "24/05/2021",
                    remarks: "Use Express.js to build it and bcrypt to store passwords",
                }, {
                    goalDetails: "Create the Back End",
                    dueDate: "28/05/2021",
                    remarks: "Use React and React Hooks alongside Bootstrap",
                },
                {
                    goalDetails: "Create the Data Base",
                    dueDate: "22/05/2021",
                    remarks: "Use Postgress and Postgress Node",
                }
            ]
        },
        {
            graduateName: "Hozan Ali",
            requestDate: "20/05/2021",
            planName: "Make a website about your products and add the option of purchase",
            goalsList: [
                {
                    goalDetails: "Create the Front End",
                    dueDate: "24/05/2021",
                    remarks: "Use Express.js to build it and bcrypt to store passwords",
                }, {
                    goalDetails: "Create the Back End",
                    dueDate: "28/05/2021",
                    remarks: "Use React and React Hooks alongside Bootstrap",
                },
                {
                    goalDetails: "Create the Data Base",
                    dueDate: "22/05/2021",
                    remarks: "Use Postgress and Postgress Node",
                }
            ]
        }

    ]

    const [plans, setPlans] = useState(fakeData);
    const [name, setName] = useState("");

    async function getName() {
        try {
            const response = await fetch("http://localhost:3000/api/dashboard/mentor", {
                method: "GET",
                headers: { token: localStorage.token }
            });

            const parseRes = await response.json();
            setName(parseRes.first_name);
        
        } catch (err) {
            console.error(err.message)
        }
    }

    const logout = (e) => {
        e.preventDefault()
        localStorage.removeItem("token");
        setAuth(false);
        toast.success("Logged out successfully");
    }

    useEffect(() => {
        getName();
    }, []);

    return (
        <div>
            <header className="header-container">
                <h1>Mentor Dashboard {name}</h1>
                <Controls.Button
                    color="secondary"
                    type="submit"
                    text="Log Out"
                />
            </header>
            <main>
                {/*<CreatePlan plan={setPlans} plansList={plans} />*/}
                <Test plan={plans} isMentor={true}/>
            </main>
        </div >
    )
};

export default MentorBoard;
