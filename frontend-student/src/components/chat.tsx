"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Search } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import axios from "axios"



export default function ChatApp() {

  const [teacher, setTeacher] = useState<any[]>([])

  const getTeacher = async () => {
    const response = await axios.get("http://localhost:3000/api/v1/teacher/allteacher")
    setTeacher(response.data.teachers)
  }

  useEffect(() => {
    getTeacher()
  }, [])

  const socket = new WebSocket("ws://localhost:3000/chat");

  socket.onopen = ()=>{
    const user = {
        name:"prayag",
        type:"connect"
    }
    socket.send(JSON.stringify(user));
  }


  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar */}
      <div className="flex flex-col w-80 bg-white border-r">
        <div className="p-3 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search or start new chat" className="pl-9" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {teacher.map((contact) => (
            <div
              key={contact.id}
              className={cn(
                "flex items-center p-3 hover:bg-gray-100 cursor-pointer border-b"
              )}
              
            >
              <Avatar className="h-12 w-12 mr-3">
                <AvatarImage src={contact.avatar} alt={contact.name} />
                <AvatarFallback>{contact.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium truncate">{contact.name}</h3>
                  <span className="text-xs text-gray-500">{contact.time}</span>
                </div>
                <p className="text-sm text-gray-500 truncate">{contact.lastMessage}</p>
              </div>
              {contact.unread > 0 && (
                <div className="ml-2 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {contact.unread}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex flex-col flex-1">
        {teacher ? (
          <>
            <div className="p-3 border-b bg-white flex items-center">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage  />
                <AvatarFallback>{}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="font-medium">{}</h2>
                <p className="text-xs text-gray-500">Online</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#e5ded8]">
              {teacher.map((m) => (
                <div  className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "max-w-[80%] px-4 py-2 rounded-lg text-sm",
                      m.role === "user"
                        ? "bg-primary text-white rounded-tr-none"
                        : "bg-white text-black rounded-tl-none"
                    )}
                  >
                    <p>{m.content}</p>
                    <p className="text-[10px] text-right mt-1 opacity-70">
                      {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-white border-t">
              <form  className="flex space-x-2">
                <Input
           
                  
                  placeholder="Type a message"
                  className="flex-grow"
                />
                <Button type="submit" >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-center text-gray-500 p-4">
            <div>
              <h2 className="text-xl font-medium mb-2">Select a chat to start messaging</h2>
              <p>Choose a contact from the list to start a conversation</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
