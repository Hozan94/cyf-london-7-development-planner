import React from "react";

function Welcome() {
    return (
			<div>
				
				<div className="main">
                 <div className="image-wrapper">
				  <img src="client\src\img\CodeYourFuture2.jpeg"  className="cyf-image" alt="cyf" />	 
				 </div>
                 <div className="title">
					<h1><span className="dev">Development</span><br/> Planner</h1> 
					<p className="txt-slogen">If you’re looking for a holistic  app that covers tasks,<br/> routines, goals and habits, try Development Planner</p>
				 </div>
				
				</div>

               <footer className="footer">
			       <p>&copy;Devlopment Planner 2021</p> 
			   </footer>
			
				
			</div>
		);
}

export default Welcome;
