import React,{useState,useEffect} from 'react'

function MentorDropDown({setMentorId}) {
    const [mentorName, setMentorName] = useState([]);
   
     async function getMentors(){
         const mentors = await fetch('http://localhost:3000/api/mentors');
         const parse=await mentors.json()
         setMentorName(parse.mentors.map((mentor)=>{
         return {
            mentor_name:`${mentor.first_name}  ${mentor.last_name} `,
            mentor_id: mentor.id   
         } 
         }));
         
     }
  
    
     useEffect(() => {
          getMentors();
     }, [])
  

const handelChange = (e) =>{
    setMentorId(e.target.value);
}

    return (
			<div>
				<label for="cars">Choose a car:</label>
               <select name="cars" id="cars"  onChange={handelChange}  >
                {mentorName.map((name)=>(
                  <option key={name.mentor_id} value={name.mentor_id}>{name.mentor_name}</option>  
                ))}  		
				</select>
			</div>
		);
}

export default MentorDropDown
