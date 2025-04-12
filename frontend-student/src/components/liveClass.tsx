import * as mediasoup from "mediasoup-client"
import { useEffect } from "react";
let device: mediasoup.types.Device;
let socket: WebSocket;
let remote_video: HTMLVideoElement | null;
let transport: mediasoup.types.Transport;
let remoteStream: MediaStream;

const LiveClass = ()=>{

    useEffect(()=>{
      setTimeout(() => {
        reciverHandler();
      }, 3000);
    },[])
    socket = new WebSocket("ws://localhost:3000/ws");

    socket.onopen = () => {
      if (socket.readyState === WebSocket.OPEN) {
        console.log("connected");
        const msg = {
          type: "getRouterRtpCapabilities",
        };
        socket.send(JSON.stringify(msg));
      }
    };

    socket.onmessage = (event)=>{

        const res = JSON.parse(event.data);

        console.log(res);
        switch (res.type) {
            case 'routerCapabilities':
                onRouterRtpCapabilities(res);
                break;
            case 'subTransportCreated':
                onsubTransportCreated(res);
                break;

            case 'resumed':
                console.log(event.data);
                break;

            case 'subscribed':
              onSubscribe(event);
              break;
              
            case 'closed':
                console.log("hello");
                onBroadcasterclosed()
              break;

            default:
              break;
          }
    };
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
        // console.log("socket id :",res.id);
        
        loadDevice(res.data);
    };

    const reciverHandler = ()=>{
      console.log("reciver is starting .... ")
      document.getElementById("local_stream")?.removeAttribute("hidden");
      document.getElementById("chat")?.removeAttribute("hidden");
      const msg = {
        type:"createConsumerTransport",
        forceTcp:false,
      }
      const message = JSON.stringify(msg);
      socket.send(message);
    } 

    const onBroadcasterclosed = ()=>{
      console.log("producer close call");
      // remoteStream.removeTrack
      // transport.close();
      
    }

    
    const onsubTransportCreated =async (event:any)=>{
      if(event.error){
        console.error("on sub transport create error :",event.error);
      }
    transport = device.createRecvTransport(event.data);
    console.log("params : ",event.data);

    transport.on('connect',({dtlsParameters},callback,errback)=>{
      // console.log("connected to server")
      // console.log(" get dtlsParamters : ",dtlsParameters);
        const msg={
            type:"connectConsumerTransport",
            transportId:transport.id,
            dtlsParameters
        }
        // console.log("message : ",msg);
        const message = JSON.stringify(msg);
        socket.send(message);
        socket.addEventListener('message',(event)=>{
            let res = JSON.parse(event.data);
            if(res.type == "subConnected"){
              // console.log("consumer transport connected!!!")
              callback();
            }
        });
      }),
      transport.on('connectionstatechange',async (state)=>{
        const statusText = document.getElementById('text_p');
        switch(state){
          case 'connecting':
            if(statusText) statusText.innerHTML = "subscribing...";
            break;
          case 'connected':
            const remote_video = document.getElementById("remote_stream") as HTMLVideoElement;
            if(remote_video) remote_video.srcObject = remoteStream;
            const msg = {
              type : "resume"
            }
            socket.send(JSON.stringify(msg));
            if(statusText) statusText.innerHTML = "subscribed";
            break;
          case 'failed':
            transport.close();
            if(statusText) statusText.innerHTML = "failed";
            break;
          default:
            break;
        }
      });
      const stream = await consumer();
    }

    const consumer = async ()=>{
      let {rtpCapabilities} = device;
      const msg = {
        type : "consume",
        rtpCapabilities
      }
      socket.send(JSON.stringify(msg));
    }


    const onSubscribe = async (event:any) => {
      const res = JSON.parse(event.data);
      const {
        producerId,
        id,
        kind,
        rtpParameters,
      } = res.data;

      // let codecOption = {};
   
      const consumer = await transport.consume({
        id,
        producerId,
        kind,
        rtpParameters,
        
      });
      console.log("this is consumer :",consumer);

      if (!remoteStream ) {
        remoteStream = new MediaStream();
        
        remote_video = document.getElementById("remote_stream") as HTMLVideoElement;

        if(remote_video) remote_video.srcObject = remoteStream;

        remoteStream.addTrack(consumer.track);  
    }
  }

      return(<div>
        <div className="w-full flex flex-row ">
            <video  className="w-5xl" id="remote_stream" autoPlay></video>
            <div hidden className="border-2 w-2xl border-amber-950" id="chat"></div>

        </div>
        <div><p id='text_p'></p></div>
        {/* <div>
            <button className="bg-red-500 text-white p-1 rounded-sm"  id="btn_sub" onClick={reciverHandler}>connect</button>
        </div> */}
      </div>)
    
}
export default LiveClass;
