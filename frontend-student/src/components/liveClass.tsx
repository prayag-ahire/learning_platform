import * as mediasoup from "mediasoup-client"
import { Consumer } from "mediasoup-client/types";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {v4} from "uuid";



let device: mediasoup.types.Device;
let socket: WebSocket;
let remote_video: HTMLVideoElement | null;
let transport: mediasoup.types.Transport;
let remoteStream: MediaStream;

const LiveClass = (roomId:string)=>{

  const Navigate = useNavigate();
  const [searchParams] = useSearchParams();
  roomId = searchParams.get("room") || " ";
  const id = v4();
  useEffect(()=>{
    socket = new WebSocket("ws://localhost:3000/ws");

    socket.onopen = () => {
      if (socket.readyState === WebSocket.OPEN) {
        console.log("connected");
        const msg = {
          type: "getRouterRtpCapabilities",
          roomId
        };
        socket.send(JSON.stringify(msg));
      }
    };

    socket.onmessage = (event)=>{

        const res = JSON.parse(event.data);

        
        switch (res.type) {

            case 'routerCapabilities':
                onRouterRtpCapabilities(res);
                break;
            case 'subTransportCreated':
                onsubTransportCreated(id,res);
                break;

            case 'resumed':
                console.log(event.data);
                break;

            case 'subscribed':
              onSubscribe(event);
              break;
              
            case 'closed':
                onBroadcasterclosed(res.data);
              break;

            default:
              break;
          }
    };
  },[]);


       const loadDevice = async (routerRtpCapabilities:mediasoup.types.RtpCapabilities) => {
            try{
                device = new mediasoup.Device();
            }catch(error:any){
                if (error.name === "UnsupportedError") {
                    console.log("Browser not supported!");
                }
            }
            await device.load({
              routerRtpCapabilities:routerRtpCapabilities,
            });
            console.log("RTP capabilities :",device.rtpCapabilities);
        };
    
    
    const onRouterRtpCapabilities = (res:any) => {
        console.log(res.data);
        loadDevice(res.data);
        reciverHandler();
    };

    const reciverHandler = ()=>{
      console.log("reciver is starting .... ")
      document.getElementById("local_stream")?.removeAttribute("hidden");
      document.getElementById("chat")?.removeAttribute("hidden");
      const msg = {
        type:"createConsumerTransport",
        forceTcp:false,
        roomId,
        id
      }
      const message = JSON.stringify(msg);
      socket.send(message);
    } 

    const onBroadcasterclosed = (event:any)=>{
      console.log("this is from close event",event);
      if(event === roomId){
        console.log("producer close call");
      remoteStream.removeTrack
      transport.close();
      Navigate("/ ")
      }
    }

    
    const onsubTransportCreated =async (id:any,event:any)=>{

      if(event.error){
        console.error("on sub transport create error :",event.error);
      }
    transport = device.createRecvTransport(event.data);
    console.log("params : ",event.data);

    transport.on('connect',({dtlsParameters},callback)=>{

        const msg={
            type:"connectConsumerTransport",
            transportId:transport.id,
            dtlsParameters,
            roomId,
            id
        }
        const message = JSON.stringify(msg);
        socket.send(message);
        socket.addEventListener('message',(event)=>{
            let res = JSON.parse(event.data);
            if(res.type == "subConnected"){
              console.log("consumer transport sub-connected!!!")
              callback();
            }
        });
      }),

      transport.on('connectionstatechange',async (state)=>{

        switch(state){

          case 'connecting':
            break;

          case 'connected':
            const remote_video = document.getElementById("remote_stream") as HTMLVideoElement;
            if(remote_video) remote_video.srcObject = remoteStream;
            const msg = {
              type : "resume",
              roomId,
              id
            }
            socket.send(JSON.stringify(msg));
            break;

          case 'failed':
            transport.close();
            break;

          default:
            break;
        }
      });
      await consumer();
    }

    const consumer = async ()=>{
      console.log("this is from consumer")
      let {rtpCapabilities} = device;
      console.log(rtpCapabilities);
      const msg = {
        type : "consume",
        rtpCapabilities,
        roomId,
        id
      }
      socket.send(JSON.stringify(msg));
    }


    const onSubscribe = async (event:any) => {

      
      const temp = JSON.parse(event.data);
      const res:Consumer[] = temp.data;
      
      console.log(temp.data);

      if (!remoteStream ) {
        remoteStream = new MediaStream();
        
        remote_video = document.getElementById("remote_stream") as HTMLVideoElement;

        if(remote_video) remote_video.srcObject = remoteStream;

    }

      res.forEach(async(x)=>{
        const {
          producerId,
          id,
          kind,
          rtpParameters,
        } = x
        const consumer = await transport.consume({
          id,
          producerId,
          kind,
          rtpParameters
        })

        remoteStream.addTrack(consumer.track);
      })
  }

      return(<div>
        <div className="w-full flex flex-row ">
            <video  className="w-5xl" id="remote_stream" autoPlay></video>
            <div hidden className="border-2 w-2xl border-amber-950" id="chat"></div>
        </div>
      </div>)
    
}
export default LiveClass;
