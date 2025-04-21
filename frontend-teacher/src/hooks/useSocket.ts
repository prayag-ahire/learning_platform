import { useEffect, useState } from "react"


export const useSocket = ()=>{
    const [socket,setSocket] = useState<WebSocket | null>(null);

    useEffect(()=>{
        const ws = new WebSocket("ws://localhost:3000/ws");
        ws.onopen = ()=>{
            console.log("connected to server"); 


            setSocket(ws);
        }

        ws.onclose = ()=>{
            ws.close();
            setSocket(null);
        }
        return ()=>{
            ws.close();
        }
    },[]);
    return socket;
}