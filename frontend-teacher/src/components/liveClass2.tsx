import { useNavigate } from "react-router-dom"

export const LiveClass2 = ()=>{
    const Navigate = useNavigate(); 

    const handler = ()=>{
        const token = localStorage.getItem("token");
        if(!token){
          Navigate("/login");
          return
        }
        Navigate("/startlive");
    }
    return(<div className="flex flex-1 ">
        <div className="flex flex-1 items-center justify-center">
            <button  className="flex space-x-2 bg-red-500 text-white font-bold p-2 rounded-2xl" onClick={handler}>
                <div><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" />
                    </svg>
                </div>
                <p>Start LiveClass</p></button>
        </div>
    </div>)
}