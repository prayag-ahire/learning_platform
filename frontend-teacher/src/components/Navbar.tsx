import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "../lib/utils";

const NavBar = ()=>{
const Navigate = useNavigate();
    const handler = ()=>{
        Navigate("/");
    }
    const {pathname} = useLocation();
    return(
        <div className="flex flex-row justify-between  mx-4 ">
            <div className="flex items-baseline gap-8 justify-between">
                <p className="text-4xl font-bold text-emerald-500 ml-4 cursor-pointer" onClick={handler}>WeTeach</p>
                <nav className="flex items-center space-x-6 text-lg font-medium">
                    {/* <Link to='/' className={cn("transition-colors hover:text-primary",pathname === "/"? "text-primary":"text-muted-foreground")}>Home</Link> */}
                    <Link to='/live-class' className={cn("transition-colors hover:text-primary",pathname === "/live-class"? "text-primary":"text-muted-foreground")}>Live Class</Link>
                    <Link to='/materials' className={cn("transition-colors hover:text-primary",pathname === "/materials"? "text-primary":"text-muted-foreground")}>Materials</Link>
                    <Link to='/students' className={cn("transition-colors hover:text-primary",pathname === "/students"? "text-primary":"text-muted-foreground")}>students</Link>
                </nav>
            </div>
        </div>
    )
}




export default NavBar;