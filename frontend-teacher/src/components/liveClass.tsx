import * as mediasoup from "mediasoup-client"
import { useEffect } from "react";


let device: mediasoup.Device;
let socket: WebSocket;
let producer: mediasoup.types.Producer;
let transport: mediasoup.types.Transport;

const LiveClass = ()=>{

    useEffect(()=>{
      // publishHandler();
    },[])
    socket = new WebSocket("ws://localhost:3000/ws");

    socket.onopen = () => {
      if (socket.readyState === WebSocket.OPEN) {
        console.log("connected");
        const msg = {
          type: "getRouterRtpCapabilities",
        }
        socket.send(JSON.stringify(msg));
      }
    }
    
    socket.onmessage = (event)=>{
      
      const res = JSON.parse(event.data);

        switch (res.type) {
            case 'routerCapabilities':
              onRouterRtpCapabilities(res);
              break;
    
            case 'ProducerTransportCreated':
              onProducerTransportCreated(res);
              break;
            
            case 'resumed':
              console.log(event.data);
              break;
            default:
              break;
          }
    };
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
      console.log("socket id:", res.id);
      
      try {
        await loadDevice(res.data);
        console.log("Device loaded successfully");
        
      
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
        }
        console.log("on click",message)
        socket.send(JSON.stringify(message));
    }


    const onProducerTransportCreated = async (event:any) => { 
      if(event.error){
        console.error(event.error);
        return;
      }
     
      transport = device.createSendTransport(event.data);
      console.log(event.data);
    
        transport.on('connect', async ({dtlsParameters }, callback,errback) => {
          
          console.log("get dtlsParameters : ",{dtlsParameters});

          
          const message = {
            transportId:transport.id,
            type: "connectProducerTransport",
            dtlsParameters,
          };
          console.log(JSON.stringify(message));
          socket.send(JSON.stringify(message));
          
          socket.addEventListener('message',(event)=>{
            let res = JSON.parse(event.data);
            console.log(res);
            if(res.type === "producerConnected"){
              console.log("got connected");
              callback();
            }
          })

        });
    
        transport.on('produce', async ({ kind, rtpParameters }, callback,errback) => {

          const message = {
            type: 'produce',
            transportId: transport.id,
            kind,
            rtpParameters,
          };
          console.log("send IceCandidates : ",message);

          socket.send(JSON.stringify(message));

          socket.addEventListener('message',(event)=>{
            let res = JSON.parse(event.data);
            if(res.type == "produced"){
              callback(res.data.id);
            }
          });
        });
    
        transport.on('connectionstatechange', async (state) => {
            const statusText = document.getElementById('text_p');

          switch (state) {
            case 'connecting':
                console.log("connecting from stat change");
                    if(statusText) statusText.innerHTML = "publishing.....";
                break;

            case 'connected':
                console.log("connected from stat change");
                if(statusText) statusText.innerHTML = "published";
                const videoele = document.getElementById('local_stream') as HTMLVideoElement;
                if(stream && videoele) videoele.srcObject = stream;
                break;

            case 'failed':
              console.log("failed from stat change");
              transport.close();
              if(statusText) statusText.innerHTML = "failed";
              break;

            default:
              break;
          }
        });
        let stream:any;
        try{
          stream = await getUserMedia();
          console.log("this is stream : ",stream);
          const videoElemnt = document.getElementById('local_stream') as HTMLVideoElement;
          videoElemnt.srcObject = stream;
          videoElemnt.muted = true;
          videoElemnt.play();
          
          
          const videoTrack = stream.getVideoTracks()[0];
          producer = await transport.produce({ track: videoTrack });
          
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
              // stream = await navigator.mediaDevices.getDisplayMedia({video:true,audio:true});
            }catch(err){
              console.log(err);
              throw err;
            }
            return stream;
          };

          
      return(<div>
        <div className="relative flex flex-row w-full  ">
            <video hidden className="border-2 w-5xl" id="local_stream" autoPlay></video>
            <div hidden className="border-2 w-2xl border-amber-950" id="chat"></div>
        </div>
        <div><p id='text_p'></p></div>
        <div className="w-full flex items-center justify-center h-full ">
            <button className="bg-red-500 text-white p-1 rounded-sm" id="btn_cam" onClick={publishHandler}>Go Live</button>
        </div>
      </div>)
    
}
export default LiveClass;