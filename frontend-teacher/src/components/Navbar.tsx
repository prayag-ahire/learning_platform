import { Link, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";

const NavBar = ()=>{

    const {pathname} = useLocation();
    return(<div className="flex flex-row items-baseline justify-between space-x-6 ">
            <p className="items-center text-4xl font-bold text-emerald-500 ml-4">Weteach</p>
            <nav className="flex items-center space-x-6 ">
                <Link to="/" className={cn("transition-colors hover:text-primary", pathname === '/' ? "text-primary":"text-muted-foreground")}>
                <p>Home</p>
                </Link>
                <Link to="/liveclass" className={cn("transition-colors hover:text-primary", pathname === '/liveclass' ? "text-primary":"text-muted-foreground")}>
                <p>liveclass</p>
                </Link>
                <Link to="/matrial" className={cn("transition-colors hover:text-primary", pathname === '/matrial' ? "text-primary":"text-muted-foreground")}>
                <p>matrial</p>
                </Link>
            </nav>
    </div>)
}

export default NavBar;