import { useNavigate } from "react-router-dom"

export const LiveClass2 = ()=>{
    const Navigate = useNavigate(); 

    const handler = ()=>{
        Navigate("/startlive");
    }
    return(<div className="flex flex-1 ">
        <div className="flex flex-1 items-center justify-center">
            <button  className="flex space-x-2 bg-red-500 text-white font-bold p-2 rounded-2xl" onClick={handler}>
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
                    </svg>
                </div>
                <p>Join LiveClass</p></button>
        </div>
    </div>)
}