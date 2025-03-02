import { Button } from "./ui/button"


export const LiveClass = ()=>{
    return(<div className="flex bg-amber-200 py-4 m-4 pl-2 rounded-2xl gap-2 items-center">
        <p className="text-2xl text-red-500 font-bold "> Live Class </p>
        <p className="font-bold "> Start in 5 min</p>
        <Button className="rounded-lg bg-black py-2 px-4  text-sm font-bold text-white data-[hover]:bg-sky-500 data-[active]:bg-sky-700">Enter</Button>
    </div>)
}