import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";


export const DashBoard = ()=>{
    
    const [token,setToken] = useState<any>(null);
    const Navigate = useNavigate();

    useEffect(()=>{
        handler();
     if(!token){
        // Navigate("/signup");
     }
    },[])

    function handler(){
        const tk = localStorage.getItem("token");
        setToken(tk);

    }
    return(<div >
        <p className="text-6xl font-bold py-44 text-center px-52 ">Welcome To The Indias Largest Learning Platform </p>
        <div>
        </div>
    </div>)
}