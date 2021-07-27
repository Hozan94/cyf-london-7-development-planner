import React, { useState } from "react";
import "./GraduateBoard.css";
import CreatePlan from "../components/CreatePlan";
import PlansTable from "../components/PlansTable";
import Controls from "../components/controls/Controls";


function LandingPage() {

    const [plans, setPlans] = useState([]);

    return (
        <div>
            <header className="header-container">
                <h1>Graduate Dashboard</h1>
                <Controls.Button
                    color="secondary"
                    type="submit"
                    text="Log Out"
                />
            </header>
            <main>
                <CreatePlan plan={setPlans} plansList={plans} />
                <PlansTable plan={plans} />
            </main>
        </div >
    );
}

export default LandingPage;
