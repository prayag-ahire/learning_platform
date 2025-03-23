import { Button } from "./ui/button";

const LiveClass = ()=>{
    return(<div>
        <div className="flex flex-col items-center space-y-1 p-2 border-2 rounded-2xl border-emerald-600 m-2 justify-center max-w-full max-h-auto">
            <h1 className="">Click to go live</h1>
            <Button>Go Live </Button>
        </div>
    </div>)
}

export default LiveClass;