
// export default function Landing() {
    //     return (
        //         <div>
        //             Landing page
        //             <SignOutButton/>
        
        //         </div>
        //     )
        // }
import React from "react";        
import { SignOutButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";


export default function Landing() {
  const [events, setEvents] = useState([]);
   const { user } = useUser();
  //  console.log(`Hello ${data.taget_date}`);
   
  // useEffect needs to be handled differently in tests. It needs to be mocked. I am not sure if this would happen on the landing page anyway. 
  // It would probably be triggered by another part of our logic. So, i have commented it for now.
  // leave this hear though as it shows the communication with backend google route.
// useEffect(() => {
//   if (!user) return; // Wait until user is loaded

//   async function fetchEvents() {
//     const userId = user.id;
//     const startDate = new Date("2025-08-26T00:00:00Z");
//     const endDate = new Date("2025-08-27T23:59:59Z");

//     const response = await fetch(
//       `/api/google/google/?clerkUserId=${userId}&start=${startDate.toISOString()}&end=${endDate.toISOString()}`
//     );
//     const data = await response.json();
//     setEvents(data);
//   }
//   fetchEvents();
// }, [user]);

  return (
    <div>
      <h1>This is the events page</h1>
      <pre>{JSON.stringify(events, null, 2)}</pre>
      <div>
        <SignOutButton/>
      </div>
    </div>
  );
}