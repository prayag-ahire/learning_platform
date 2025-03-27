import { useEffect, useState } from "react"
import { Avatar, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import axios from "axios";



const Teacher = ()=>{
    const [teachers,setteachers] = useState<any[]>([])
    useEffect(()=>{
        try{
            console.log("hello");
            const fetchteacher = async()=>{
                const response = await axios("http://localhost:3000/api/v1/teacher/allteacher");
                setteachers(response.data.teachers);
        }
        fetchteacher();
    }catch(error){
        console.error("error fetching teachers")
    }
        
    },[])

    const handler = (teacherName:string)=>{
        
    }
    return(<div>
        <div>
            <h1 className="text-2xl font-medium ">Subscribed Teachers</h1>
            <div>
                // render subscribed teachers
            </div>
        </div>
        <div>
            <h1 className=" text-2xl font-medium ">More Teachers</h1>
            <div className="flex flex-wrap justify-around ">
               {teachers.map((teacher)=>(
                <div key={teacher.id} className="w-1/4 mx-5 my-5 border-2 border-black rounded-2xl ">
                <div className="flex justify-around">
                  <Avatar className="size-12">
                    <AvatarImage src={teacher.avatar || "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359554_1280.png"} />
                  </Avatar>
                  <p className="text-2xl font-medium">{teacher.name}</p>
                </div>
                <div className="flex items-center justify-center">
                  <Button onSubmit={()=>{handler(teacher.name)}}>subscribe</Button>
                </div>
              </div>
               ))} 
            </div>
        </div>
    </div>)

}

export default Teacher