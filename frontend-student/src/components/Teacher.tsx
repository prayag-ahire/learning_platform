import { Avatar, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"

const Teacher = ()=>{
    return(<div>
        <div>
            <h1 className="text-2xl font-medium ">Subscribed Teachers</h1>
            <div>
                // render subscribed teachers
            </div>
        </div>
        <div>
            <h1 className="text-2xl font-medium ">More Teachers</h1>
            <div>
               
                <div className="border-2 border-black rounded-2xl w-1/6">
                    <div className="flex  justify-around">
                        <Avatar className="size-12">
                            <AvatarImage src="https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359554_1280.png"/>
                        </Avatar>
                        <p className="text-2xl font-medium">shri nivasan</p>
                    </div>
                    <div className="flex items-center justify-center">
                        <Button>join</Button>
                    </div>
                </div>

                
            </div>
        </div>
    </div>)

}

export default Teacher