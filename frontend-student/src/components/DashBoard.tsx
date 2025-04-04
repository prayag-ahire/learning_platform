import { useEffect } from "react"
// import { useNavigate } from "react-router-dom";


export const DashBoard = ()=>{

    const date =  window.Date();
    useEffect(()=>{

        const tk = localStorage.getItem("token");
    
        console.log(tk);
   
    },[])
    return(<div >
                <div className="text-2xl p-2 font-bold">
                    <p>Welcome , Student flash</p>
                    <p>{date}</p>
                    </div>
        <p className="text-6xl font-bold py-44 text-center px-52 ">Welcome To The Indias Largest Learning Platform </p>
        <div>
        </div>
    </div>)
}