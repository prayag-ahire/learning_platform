import axios from "axios";
import { useEffect, useState } from "react"

export const Students =()=>{
    const token = localStorage.getItem("token");
    const [Students,setStudents] = useState<any[]>([]);

    const joinstudent = async ()=>{
        const response = await axios.post("http://localhost:3000/api/v1/teacher/joinstudent",{
            token
        })
        setStudents(response.data.user.students);
        console.log(response.data.user.students);
    }
    useEffect(()=>{
        joinstudent()
    },[]);
    return(<div className="h-full flex flex-1 justify-center">
        <div className=" border-2 border-black mx-50 w-1/2">
        {Students.map(x=>
            <div className="flex justify-around h-15 items-center text-2xl border-2 border-black m-2 rounded-2xl ">
            <div><p>{x.student.name}</p></div>
            <div className="text-green-400"><p>online</p></div>
            <div><p>id:{x.student.id}</p></div>
        </div>
        )}
            
        </div>
    </div>)
}