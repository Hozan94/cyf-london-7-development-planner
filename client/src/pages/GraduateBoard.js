import React, { useState, useEffect } from 'react';
import './Dashboards.css';
import CreatePlan from '../components/CreatePlan';
//import PlansTable from '../components/PlansTable';
import Controls from '../components/controls/Controls';
import Test from '../components/Test'
import { toast } from "react-toastify";
import { useHistory } from "react-router";


function GraduateBoard() {
    const history = useHistory();
    const [plans, setPlans] = useState([]);
    const [graduate, setGraduate] = useState("");

    async function getName() {
        try {
            const response = await fetch("http://localhost:3000/api/dashboard/graduate", {
                method: "GET",
                headers: { token: localStorage.token },
            });

            const parseRes = await response.json();
            setGraduate(parseRes);
        } catch (err) {
            console.error(err.message);
        }
    }

    const logout = (e) => {
        e.preventDefault();
        // localStorage.removeItem("token");
        localStorage.clear();
        history.push(`/login`);
        toast.success("Logged out successfully");
    };

    useEffect(() => {
        getName();
    }, []);

    return (
        <div>
            <header className="header-container">
                <h1>Graduate Dashboard {graduate.id}</h1>
                <Controls.Button
                    color="secondary"
                    type="submit"
                    text="Log Out"
                    onClick={logout}
                />
            </header>
            <main>
                <CreatePlan plan={setPlans} plansList={plans} graduateId={graduate.id}/>
                {/*<PlansTable plan={plans} />*/}
                <Test plans={plans} isMentor={false}/>
            </main>
        </div >
    );
}

export default GraduateBoard;
