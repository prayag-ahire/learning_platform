import { useEffect, useState } from "react"


export const DashBoard = ()=>{
    
    const [token,setToken] = useState<any>(null);

    useEffect(()=>{
        handler();
     if(!token){
     }
    },[])

    function handler(){
        const tk = localStorage.getItem("token");
        setToken(tk);

    }
    return(<div >
        <div className="text-2xl p-2 font-bold text">
            <p>Good Morninng , Teacher prayag</p>
            <p>{window.Date()}</p>
            </div>
        <div>
            <p className="text-6xl font-bold py-44 text-center px-52 ">Welcome To The Indias Largest Learning Platform </p>
        </div>
        <div>
        </div>
    </div>)
}