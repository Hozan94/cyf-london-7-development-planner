import React,{useState,useEffect} from 'react'
import "./aside.css";
function AsideBar() {
    const [feedbackDetails, setFeedbackDetails] = useState([]);

    async function getFeedbacks() {
		try {
			const feedbacks = await fetch(
				"http://localhost:3000/api/graduates/6/feedbacks",
				{
					method: "GET",
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
				}
			);
          
			const parseRes = await feedbacks.json();
           	
			setFeedbackDetails(parseRes);
			console.log(parseRes);
		} catch (err) {
			console.error(err.message);
		}
	}

    useEffect(() => {
		
		getFeedbacks();
	}, []);


    return (
        <div className="side"  >
        <h1>New Feed Backs</h1>    
     <div >
     
     <div className="feedback-container">
 <div className="plan-name">
          


      </div>
     
     
      {/* <div className="feedback-status">
          <h2>FeedBack Status</h2>
      </div>  */}
         
      </div>
                                          
<h2>Plane Name </h2>
                        
     <ul className="ul" >
						                                                        
                        {feedbackDetails.map((item) => (
							<li key={item.id}>
								<div className="plan-name">
                                   
                                <a href="#">{item.plan_name} </a>
								
									{/* <p>{item.plan_name} </p>
									<p >{item.feedback_details}</p>
									<p>{item.name} </p> */}


								</div>
							</li>
						))}

						
					</ul>
      
    


					
				
					
					
				</div>

  
     </div>
         
        
    
    
    
    
    
         )





}

export default AsideBar
