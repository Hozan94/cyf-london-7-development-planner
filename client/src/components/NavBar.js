import React from "react";
import "bulma/css/bulma.min.css";
import  { useState,useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useHistory } from "react-router";
import { toast } from "react-toastify";


export default function NavBar() {
    const [isOpen, setOpen] = useState(false);
	const loggedIn = !!localStorage.getItem("token");
	const history = useHistory();
	
	console.log(loggedIn);
    //  const [log , setLog] = useState(loggedIn);

	//  useEffect(()=>{
    //   setLog(log)
    // },[log])

	 const logout = (e) => {
        e.preventDefault();
        localStorage.clear();
        history.push(`/login`);
        toast.success("Logged out successfully");
		//window.location.reload();
    }


   return (
			<nav
				className="navbar is-primary"
				role="navigation"
				aria-label="main navigation"
			>
				<div className="container">
					<div className="navbar-brand">
						<a
							role="button"
							className={`navbar-burger burger ${isOpen && "is-active"}`}
							aria-label="menu"
							aria-expanded="false"
							onClick={() => setOpen(!isOpen)}
						>
							<span aria-hidden="true"></span>
							<span aria-hidden="true"></span>
							<span aria-hidden="true"></span>
						</a>
					</div>

					<div className={`navbar-menu ${isOpen && "is-active"}`}>
						<div className="navbar-start">
							
							
							   <NavLink
								className="navbar-item"
								activeClassName="is-active"
							 	to="/welcome"
							    >
								Home
							   </NavLink>

						                      
						{loggedIn  ? (  
                           <>
                              <NavLink
								className="navbar-item"
								activeClassName="is-active"
								to="/login"
								onClick={logout}
							    >
								Logout
							   </NavLink>   

						   </>

						  ):(
                         <>
	                    
					   
					        <NavLink
								className="navbar-item"
								activeClassName="is-active"
								to="/signUp"
							>
								Sign Up
							</NavLink>
                        <NavLink
						className="navbar-item"
						activeClassName="is-active"
						to="/login"
						>
							Login
					   </NavLink>
                        </>
						)
					
						
						}
						
						
							
							
                            

							

						</div>

						{/* <div className="navbar-end">
							<div className="navbar-item">
								<div className="buttons">
									<a className="button is-white">Log in</a>
								</div>
							</div>
						</div> */}
					</div>
				</div>
			</nav>
		);
}
