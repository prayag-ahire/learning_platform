import axios from "axios";
import { useNavigate,useSearchParams } from "react-router-dom"
import { useEffect, useState } from "react";
import { AvatarImage,Avatar } from "./ui/avatar";

export const LiveClass2 = ()=>{
    const Navigate = useNavigate(); 
    const [jointeacher,setJointeacher] = useState<any[]>();
    const [searchParams,setSearchParams] = useSearchParams();

    const getliveclass = async ()=>{
        const token = localStorage.getItem("token");
        if(!token){
          Navigate("/login")
          return;
        }
        const res = await axios.post("http://localhost:3000/api/v1/student/live",{
          token
        });
        console.log(res.data.mesg[0].teacher.length === 0);
        setJointeacher(res.data.mesg[0].teacher);
        
      }
    useEffect(()=>{
      getliveclass();
    },[])

    if(jointeacher?.length === 0) return( <div className="flex justify-center items-center flex-1">
      <div className="text-2xl font-bold">
      No Teacher Is Live
      </div>
      </div>)
  
    const handler = (room:string)=>{
      console.log(room);
        setSearchParams({room:room});
        Navigate(`/startlive/?room=${room}`);
    }
    return(<div className="w-full">
          <div></div>
          <div className="flex p-5">
            {jointeacher?.map((x)=>(
          <button  className="hover:bg-red-300 items-center rounded-2xl" onClick={()=>{handler(x.teacher.room)}}>
              <div key={x.id} className="flex justify-around p-2 w-full  border-2 border-black rounded-2xl ">
              <div className="flex space-x-2 items-center">
                <Avatar className="size-12">
                  <AvatarImage src={  "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359554_1280.png"} />
                </Avatar>
                <p className="text-2xl font-medium ">{x.teacher.name} is live now</p>
              </div>
              </div>
            </button>  
            ))}
            </div>


        {/* <div className="flex flex-1 items-center justify-center">
            <button  className="flex space-x-2 bg-red-500 text-white font-bold p-2 rounded-2xl" onClick={handler}>
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
                    </svg>
                </div>
                <p>Join LiveClass</p></button>
        </div> */}
    </div>)
}