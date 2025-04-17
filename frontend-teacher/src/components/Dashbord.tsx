import { useEffect, useState } from "react"


export const DashBoard = ()=>{
    

    const date =  new Date();
    const [datetime , setDateTime] = useState("");


    useEffect(()=>{
        const tk = localStorage.getItem("token");
        console.log(tk);
        setDateTime(date.toLocaleString('en-in',{weekday:'long',hour:'2-digit',minute:"2-digit",hour12:true}));
        setInterval(()=>{
            setDateTime(date.toLocaleString('en-in',{weekday:'long',hour:'2-digit',minute:"2-digit",hour12:true}));
            console.log(datetime);    
        },60000);
    },[])

    
    return(<div >
        <div className="text-2xl p-2 font-bold text">
            <p>Good Morninng , Teacher prayag</p>
            <p>{datetime}</p>
            </div>
        <div>
            <p className="text-6xl font-bold py-44 text-center px-52 ">Welcome To The Indias Largest Learning Platform </p>
        </div>
        <div>
        </div>
    </div>)
}