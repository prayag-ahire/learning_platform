import { Avatar, AvatarImage } from "./ui/avatar";
import { useNavigate } from "react-router-dom"

export const LiveClass2 = ()=>{
    const Navigate = useNavigate(); 

    const handler = ()=>{
        Navigate("/startlive");
    }
    return(<div className="flex flex-1 ">


          {/* <div className="flex">
            {jointeacher.map((x)=>(
              <div key={x.teacher.id} className="flex justify-around p-2 w-1/4 mx-5 my-5 border-2 border-black rounded-2xl ">
              <div className="grid ">
                <Avatar className="size-12">
                  <AvatarImage src={  "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359554_1280.png"} />
                </Avatar>
                <p className="text-2xl font-medium">{x.teacher.name} is live now</p>
              </div></div>))}
            </div> */}


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