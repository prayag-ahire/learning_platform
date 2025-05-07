import { useSocket } from "@/hooks/useSocket";
import * as mediasoup from "mediasoup-client"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {v4} from "uuid";

let device: mediasoup.Device;
let producer1: mediasoup.types.Producer;
let producer2: mediasoup.types.Producer;
let transport: mediasoup.types.Transport;
let stream:MediaStream | undefined;
let videoElemnt:HTMLVideoElement
let videoTrack:MediaStreamTrack | undefined;
let audioTrack:MediaStreamTrack | undefined;
let roomId:string;

interface chat {
  type:string;
  message:string;
  timestamp:string;
  roomId:string;
}



const LiveClass = ()=>{

  const [localMedia,setLocalMedia] = useState(false);
  const [value,setValue] = useState("");
  const [livechat,setLiveChat] = useState<chat[]>([]);
  const socket = useSocket();

  const Navigate = useNavigate();
  const date = new Date().toLocaleTimeString([],{
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  

    const endhandler = ()=>{
      stopOldTrack();

      transport.close();
      producer1.close();

      const msg = JSON.stringify({
        type:"broadcaster-closed",
        producerId:producer1.id,
        roomId
      }); 
      socket?.send(msg);
      Navigate("/")
    }

    const changeStream = (stream:MediaStream)=>{

       videoTrack = stream.getVideoTracks()[0];
       audioTrack = stream.getAudioTracks()[0];

      producer1.replaceTrack({track:videoTrack || null});
      producer2.replaceTrack({track:audioTrack || null});
      videoElemnt.srcObject = stream;
      videoElemnt.play();

    }
   

    const stopOldTrack = ()=>{
      stream?.getTracks().forEach(track=>track.stop());
    }
    

    const mediahandler = async()=>{
      stopOldTrack();
      if(!localMedia){
         stream = await navigator.mediaDevices.getDisplayMedia({audio:true,video:true});
        changeStream(stream);
      }else{
        stream = await navigator.mediaDevices.getUserMedia({audio:true,video:true});
        changeStream(stream);
      }
    }

    const audioHandler = ()=>{
      if(audioTrack?.enabled){
        audioTrack.enabled = false;
      }else{
        audioTrack!.enabled = true;
      }
    }

    const videoHandler = ()=>{
      if(videoTrack?.enabled){
        videoTrack.enabled = false;
      }else{
        videoTrack!.enabled = true;
      }
    }
    



   useEffect(()=>{
    if(socket == null) return;
    console.log(socket);
    
    (socket as any).id = v4();
            
    if (socket.readyState === WebSocket.OPEN) {
        console.log("connected");
        const msg = {
          type: "create-room",
          token: localStorage.getItem("token"),
        }
        socket.send(JSON.stringify(msg));
      }
    socket.onmessage = (event)=>{
      const res = JSON.parse(event.data);

        switch (res.type) {
            case 'roomCreated':
              onroomCreated(res.data);
              break;
            case 'routerCapabilities':
              onRouterRtpCapabilities(res);
              break;
    
            case 'ProducerTransportCreated':
              onProducerTransportCreated(res);
              break;
            
            case 'resumed':
              console.log(event.data);
              break;

            case "livechat":
               if(res.data.room === roomId){
                 setLiveChat(res.data.msg);
               }
              break;
            default:
              break;
          }
    }; 

  },[socket]);

    const onroomCreated = (id:string)=>{
      roomId  = id;
      console.log("this is room id");
      console.log(roomId);


      const msg = {
        type: "getRouterRtpCapabilities",
        roomId
      }
      socket?.send(JSON.stringify(msg));
    }


    const loadDevice = async (routerRtpCapabilities:mediasoup.types.RtpCapabilities) => {
      try {
        device = new mediasoup.Device();
        await device.load({
          routerRtpCapabilities: routerRtpCapabilities,
        });
        console.log("RTP capabilities:", device.rtpCapabilities);
        return true;
      } catch (error:any) {
        if (error.name === "UnsupportedError") {
          console.error("Browser not supported!");
        } else {
          console.error("Failed to load device:", error);
        }
        return false;
      }
    };


    const onRouterRtpCapabilities = async (res:any) => {
      // console.log("socket id:", res.id);
      // console.log(res.data)
      try {
        await loadDevice(res.data);
        console.log("Device loaded successfully");
        publishHandler();

      } catch (error) {
        console.error("Failed to load device:", error);
      }
    };

    
    const publishHandler = ()=>{
      console.log("Starting go Live ")
      document.getElementById("local_stream")?.removeAttribute("hidden");
      document.getElementById("chat")?.removeAttribute("hidden");

        const message = {
            type : 'createProducerTransport',
            forceTcp:false,
            rtpCapabilities:device.rtpCapabilities,
            roomId
        }
        console.log("on click",message)
        socket?.send(JSON.stringify(message));
    }


    const onProducerTransportCreated = async (event:any):Promise<void> => { 
      if(event.error){
        console.error(event.error);
        return;
      }
     
      transport = device.createSendTransport(event.data);
      console.log("ontransportcreated",event);
    
        transport.on('connect', async ({dtlsParameters }, callback) => {
          
          console.log("get dtlsParameters : ",{dtlsParameters});

          
          const message = {
            transportId:transport.id,
            type: "connectProducerTransport",
            dtlsParameters,
            roomId
          };
          console.log(JSON.stringify(message));
          socket?.send(JSON.stringify(message));
          
          socket?.addEventListener('message',(event)=>{
            let res = JSON.parse(event.data);
            // console.log(res);
            if(res.type === "producerConnected"){
              console.log("got connected");
              callback();
            }
          })

        });
    
        transport.on('produce', async ({ kind, rtpParameters }, callback) => {

          const message = {
            type: 'produce',
            transportId: transport.id,
            kind,
            rtpParameters,
            roomId
          };
          console.log("send IceCandidates : ",message);

          socket?.send(JSON.stringify(message));

          socket?.addEventListener('message',(event)=>{
            let res = JSON.parse(event.data);
            if(res.type == "produced"){
              callback(res.data.id);
            }
          });
        });
        
        transport.on('connectionstatechange', async (state) => {

          switch (state) {
            case 'connecting':
                
                break;

            case 'connected':
                const videoele = document.getElementById('local_stream') as HTMLVideoElement;
                if(stream && videoele) videoele.srcObject = stream;
                break;

            case 'failed':
              transport.close();
              break;

            default:
              break;
          }
        });
     
        try{
          stream = await getUserMedia();
          

          console.log("this is stream : ",stream);
          videoElemnt = document.getElementById('local_stream') as HTMLVideoElement;
          videoElemnt.srcObject = stream || null;
          videoElemnt.muted = true;
          videoElemnt.play();
          
          videoTrack = stream?.getVideoTracks()[0];
          audioTrack = stream?.getAudioTracks()[0];
          
          producer1 = await transport.produce({ track: videoTrack });
          producer2 = await transport.produce({ track: audioTrack });
          
         
          
        }catch(err){
          console.error(err);
          const statusText = document.getElementById('text_p');
          if (statusText) statusText.innerHTML = "failed";
        }
    }

        const getUserMedia = async () => {
            if (!device.canProduce('video')) {
              console.error('Cannot produce video');
              return;
            }
            let stream;
            try{
              stream =  await navigator.mediaDevices.getUserMedia({video:true,audio:true});
              

            }catch(err){
              console.log(err);
              throw err;
            }
            return stream;
          };

        const handler = (e:any)=>{  
            e.preventDefault();

            
            console.log(value);
          
            const message = {
              type:"chat",
              data:{
                message:value,
                timestamp:date,
                roomId
              }
            }
            setValue("");
            // console.log("message",message);
            socket?.send(JSON.stringify(message));
        }

          
      return(<div className="group">
        <div className="flex flex-row w-full h-full ">
            <video hidden className=" w-5xl  " id="local_stream" controls autoPlay></video>
            <div className="grid w-2xl h-[calc(96.7vh-64px)] grid-rows-[90%_10%] border bg-zinc-700  overflow-hidden">
                        {/* Chat Messages */}
                        <div className="overflow-y-auto h-full p-4 ">
                        
                          {livechat.map((x,i)=>{
                                      return (<div key={i} className="bg-gray-400 w-fit max-w-xs rounded-sm p-2 m-2">
                                                  <p className="font-semibold text-lg text-white w-fit max-w-xs break-words">{x.message}</p>
                                                  <p className="text-xs">{x.timestamp}</p>
                                              </div>)
                                    })}
                        </div>

                        {/* Input Box */}
                        <div className=" p-3  flex items-center">
                          <input
                            type="text"
                            onChange={(e)=>{setValue(e.target.value);}}
                            placeholder="Type your message..."
                            className="bg-white flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
                          />
                          <button className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg" type="button" onClick={handler}>
                            Send
                          </button>
                        </div>
                  </div>
            
            
        </div>
        {/* <div><p id='text_p'></p></div> */}
        <div className="absolute bottom-20 left-20 opacity-0 group-hover:opacity-60 transition-opacity duration-300">
                <div className="w-full flex flex-col items-center ">
                <div className="flex justify-around w-2xl h-10  text-white bg-black  border-2 rounded-2xl  items-center">
                   
                    <div onClick={()=>{ setLocalMedia(x=>x==true?false:true); mediahandler()}}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
                        </svg>
                    </div>

                    <div onClick={audioHandler}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
                        </svg> <div></div>
                    </div>
                    <div onClick={videoHandler}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                        </svg><div></div>
                    </div> 
                    <div onClick={endhandler}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                        </svg>
                    </div>
                </div>
                </div>
            </div>
      </div>)
    
}
export default LiveClass;