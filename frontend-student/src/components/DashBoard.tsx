import axios from "axios";
import { useEffect, useState } from "react"

export const DashBoard = ()=>{

    const date =  new Date();
    const [datetime , setDateTime] = useState("");
    const [name,setName] = useState("");

    const handler = async(tk:string)=>{
        const res = await axios.post("http://localhost:3000/api/v1/student/me",{
            tk
        });
        console.log(res.data.message);
        setName(res.data.message.name);
    }

    useEffect(()=>{
        const tk:string = localStorage.getItem("token")+"";
        handler(tk);
        

        setDateTime(date.toLocaleString('en-in',{weekday:'long',hour:'2-digit',minute:"2-digit",hour12:true}));
        setInterval(()=>{
            setDateTime(date.toLocaleString('en-in',{weekday:'long',hour:'2-digit',minute:"2-digit",hour12:true}));
        },60000);
    },[])
    return(<div >
                <div className="text-2xl p-2 font-bold">
                    <p>Welcome , Student {name}</p>
                    <p>{datetime}</p>
                    </div>
        <p className="text-6xl font-bold py-44 text-center px-52 ">Welcome To The Indias Largest Learning Platform </p>
        <div>
        </div>
    </div>)
}