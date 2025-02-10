import { useState } from "react"
import { ProfileIcon } from "./profile/profileicon"
import { Login } from "./login";
import { Signup } from "./signup";

export const Navbar = ()=>{
    const [user,SetUser] = useState(false);
    return(
        <div className="flex flex-row justify-between mx-4">
            <div>
                <p className="text-4xl font-bold text-emerald-500 ml-4 mt-4">WeTeach</p>
            </div>
            <div className="mt-2 mr-4">
                {!user ? <div className="flex gap-2 mt-2"><Signup/> <Login/></div> : <ProfileIcon/>}
            </div>
        </div>
    )
} 

