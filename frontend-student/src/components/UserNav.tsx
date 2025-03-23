import { DropdownMenu, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenuContent } from "./ui/dropdown-menu";
import { useState } from "react";
import { Link } from "react-router-dom";
import { User } from "lucide-react";

const UserNav = ()=>{
    const [userName] = useState("Flash");
    const [userEmail] = useState("flash@gmail.com");

    return(<div>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 roundded-full">
                    <Avatar className="h-10 w-10">
                        <AvatarImage />
                        <AvatarFallback className="font-medium ">FL</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>
                    <div>
                        <p>{userName}</p>
                        <p>{userEmail}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuItem asChild>
                    <Link to="/profile">
                        <User/>
                        <span>profile</span>
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </div>)
}

export default UserNav;