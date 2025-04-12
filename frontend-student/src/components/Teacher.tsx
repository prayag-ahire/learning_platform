import { useEffect, useState } from "react"
import { Avatar, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import axios from "axios";



const Teacher = ()=>{
    const [teachers,setteachers] = useState<any[]>([])
    const [jointeacher,setJoinTeacher] = useState<any[]>([]);
    const token = localStorage.getItem("token");

    useEffect(()=>{
        try{
            const fetchteacher = async()=>{
                const response = await axios.get("http://localhost:3000/api/v1/teacher/allteacher");
                setteachers(response.data.teachers);

                const response2 = await axios.post(`http://localhost:3000/api/v1/student/jointeacher`,{
                  token
                });
                setJoinTeacher(response2.data.message.teacher);
                console.log(response2.data.message.teacher)
            }
            fetchteacher();

        
        }catch(error){
        console.error("error fetching teachers")
    }
        
    },[])

    const handler = async(teacherid:string)=>{
        alert("handler");
        console.log(teacherid,token);
        const response = await axios.post("http://localhost:3000/api/v1/student/subscribe",{
          teacherid,
          token
        })

        console.log(response);
        if(response){
          alert("subscribe sucseful")
        }
    }
    return(<div>
        <div>
            <h1 className="text-2xl font-medium ">Subscribed Teachers</h1>
            <div className="flex">
            {jointeacher.map((x)=>(
              <div key={x.teacher.id} className="flex justify-around p-2 w-1/4 mx-5 my-5 border-2 border-black rounded-2xl ">
              <div className="grid ">
                <Avatar className="size-12">
                  <AvatarImage src={  "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359554_1280.png"} />
                </Avatar>
                <p className="text-2xl font-medium">{x.teacher.name}</p>
              </div></div>))}
            </div>
        </div>

        <div>
            <h1 className=" text-2xl font-medium ">More Teachers</h1>
            <div className="flex flex-wrap ">
               {teachers.map((teacher)=>(
                <div key={teacher.id} className="flex justify-around p-2 w-1/4 mx-5 my-5 border-2 border-black rounded-2xl ">
                <div className="grid ">
                  <Avatar className="size-12">
                    <AvatarImage src={teacher.avatar || "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359554_1280.png"} />
                  </Avatar>
                  <p className="text-2xl font-medium">{teacher.name}</p>
                </div>
                <div className="flex flex-col items-center space-y-2">
                    <Button className="bg-gradient-to-r from-violet-600 to-indigo-600" onClick={()=>{handler(teacher.id)}}>subscribe</Button>
                    <Button>More info</Button>
                </div>
              </div>
               ))} 
            </div>
        </div>
    </div>)

}

export default Teacher