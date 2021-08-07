import React from "react";
// import "bulma/css/bulma.min.css";
import  { useState } from "react";
import { NavLink } from "react-router-dom";
import { useHistory } from "react-router";
import { toast } from "react-toastify";
import "./navbar.css";
export default function NavBar() {
    const [isOpen, setOpen] = useState(false);
	const loggedIn = !!localStorage.getItem("token");
	const userType = localStorage.getItem("userType");
	const history = useHistory();
	
	

	 const logout = (e) => {
        e.preventDefault();
        localStorage.clear();
        history.push(`/login`);
        toast.success("Logged out successfully");
		//window.location.reload();
    }


   return (
	   <div>
			<nav className="nav-bar">
			<div className="container">	
			{/* <div class="hamburger_menu_and_text">
                   <div class="hamburger_menu_box">
                       <div class="line"></div>
                 </div>
				 </div> */}
				
                           <div className="left-links">  
							
							
							   <NavLink
								className="navbar-item-home"
								activeClassName="is-active"
							 	to="/welcome"
							    >
								Home
							   </NavLink>

						     </div>  
							 <div className="right-links">               
						{loggedIn  ? (  
							
                           <>
                              <NavLink
								className="navbar-item-logout"
								activeClassName="is-active"
								to="/login"
								onClick={logout}
							    >
								Logout
							   </NavLink>   

						 
                              <NavLink
								className="navbar-item-logout"
								activeClassName="is-active"
								to={`/dashboard/${userType}`}
								
							    >
								My Dashboard
							   </NavLink>   

						   </>

						  ):(
                         <>
	                    
					   
					        <NavLink
								className="navbar-item-signup"
								activeClassName="is-active"
								to="/signUp"
							>
								Sign Up
							</NavLink>
                        <NavLink
						className="navbar-item-login"
						activeClassName="is-active"
						to="/login"
						>
							Login
					   </NavLink>
                        </>
						)
					
						
						}
						
						</div>
							
							

			</div>

			  
			</nav>

           </div>
			
		);
}
