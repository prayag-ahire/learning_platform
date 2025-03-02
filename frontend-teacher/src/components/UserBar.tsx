import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuSeparator ,DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger  } from "./ui/dropdown-menu";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { Link } from "react-router-dom";
import { User } from "lucide-react";
import { Button } from "./ui/button";

const UserNav = ()=>{
    const [username] = useState("Teacher");
    const [useremail] = useState("Teacher@gmail.com");
    return(<div>
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 roundded-full">
                        <Avatar>
                            <AvatarImage src=""></AvatarImage>
                            <AvatarFallback>T</AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>
                        <div>
                            <p>{username}</p>
                            <p>{useremail}</p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem asChild>
                        <Link to="/profile" >
                        <User/>
                        <span>Profile</span></Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    </div>)
}

export default UserNav;