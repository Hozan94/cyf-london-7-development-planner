import React, { useState, useEffect } from 'react';
import './GraduateBoard.css';
import CreatePlan from '../components/CreatePlan';
import PlansTable from '../components/PlansTable';
import Controls from '../components/controls/Controls';
import { toast } from "react-toastify";



function GraduateBoard({ setAuth }) {

    const [plans, setPlans] = useState([]);
    const [name, setName] = useState("");

    async function getName() {
        try {
            const response = await fetch("http://localhost:3000/api/dashboard/graduate", {
                method: "GET",
                headers: { token: localStorage.token }
            });

            const parseRes = await response.json();
            // console.log("this is some id",parseRes);
            setName(parseRes.first_name);
            console.log(`name is ${parseRes.first_name}`)
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
                <h1>Graduate Dashboard {name}</h1>
                <Controls.Button
                    color="secondary"
                    type="submit"
                    text="Log Out"
                />
            </header>
            <main>
                <CreatePlan plan={setPlans} plansList={plans}/>
                <PlansTable plan={plans} />
            </main>
        </div >
    )
};

export default GraduateBoard;
