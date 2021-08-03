import React,{useState,useEffect} from 'react'

function MentorDropDown() {
    const [mentorName, setMentorName] = useState();
     async function getMentors(){
         const mentors = await fetch('http://localhost:3000/api/mentors');
         const parse=await mentors.json()
         setMentorName(parse.mentors);
         console.log(mentorName);
     }
     useEffect(() => {
          getMentors();
     }, [])
  
    return (
			<div>
				<label for="cars">Choose a car:</label>
            <select name="cars" id="cars" >
                
					<option value="volvo">Volvo</option>
					
				</select>
			</div>
		);
}

export default MentorDropDown
