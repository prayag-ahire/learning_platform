
import { cn } from "@/lib/utils"
import {Link,useLocation, useNavigate} from "react-router-dom"


export const Navbar = ()=>{
    const Navigate = useNavigate();
    const {pathname} = useLocation();   
    const handler = ()=>{
        Navigate("/");
    }
    return(
        <div className="flex flex-row justify-between  mx-4 ">
            <div className="flex items-baseline gap-8 justify-between">
                <p className="text-4xl font-bold text-emerald-500 ml-4 cursor-pointer" onClick={handler}>WeTeach</p>
                <nav className="flex items-center space-x-6 text-lg font-medium">
                    {/* <Link to='/' className={cn("transition-colors hover:text-primary",pathname === "/"? "text-primary":"text-muted-foreground")}>Home</Link> */}
                    <Link to='/live-class' className={cn("transition-colors hover:text-primary",pathname === "/live-class"? "text-primary":"text-muted-foreground")}>Live Class</Link>
                    <Link to='/materials' className={cn("transition-colors hover:text-primary",pathname === "/materials"? "text-primary":"text-muted-foreground")}>Materials</Link>
                    <Link to='/teachers' className={cn("transition-colors hover:text-primary",pathname === "/teachers"? "text-primary":"text-muted-foreground")}>teacher</Link>
                </nav>
            </div>
        </div>
    )
} 

