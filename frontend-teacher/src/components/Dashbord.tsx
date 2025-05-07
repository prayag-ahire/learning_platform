import axios from "axios";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";


export const DashBoard = ()=>{
    

    const date =  new Date();
    const [datetime , setDateTime] = useState("");
    const [name,setName] = useState("");
    const Navigate = useNavigate(); 


    const handler = async(tk:string)=>{
        const res = await axios.post("http://localhost:3000/api/v1/teacher/me",{
            tk
        });
        setName(res.data.message.name);
    }

    useEffect(()=>{
        const tk:string = localStorage.getItem("token")+"";
        if(!tk){
            Navigate("/login");
            return
          }
        handler(tk);
        setDateTime(date.toLocaleString('en-in',{weekday:'long',hour:'2-digit',minute:"2-digit",hour12:true}));
        setInterval(()=>{
            console.log("setInterval");
            setDateTime(date.toLocaleString('en-in',{weekday:'long',hour:'2-digit',minute:"2-digit",hour12:true}));
        },60000);
    },[])

    
    return(<div >
        <div className="text-2xl p-2 font-bold text-white">
            <p>Good Morninng , Teacher {name}</p>
            <p>{datetime}</p>
            </div>
        <div>
            <p className="text-6xl font-bold py-44 text-center px-52 text-white">Welcome To The Indias Largest Learning Platform </p>
        </div>
        <div>
        </div>
    </div>)
}