import * as mediasoup from "mediasoup-client"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


let device: mediasoup.Device;
let socket: WebSocket;
let producer: mediasoup.types.Producer;
let transport: mediasoup.types.Transport;
let stream:MediaStream | undefined;
let videoElemnt:HTMLVideoElement

const LiveClass = ()=>{
  const [videos,setVideo] = useState<[MediaStreamTrack,boolean]>();
  const [audios,setAudio] = useState<[MediaStreamTrack,boolean]>();

  const [localMedia,setLocalMedia] = useState(true);

  const Navigate = useNavigate();

  
    useEffect(()=>{
      setTimeout(()=>{
        publishHandler();
      },5000)
    },[])

    const endhandler = ()=>{
      stream?.getVideoTracks().forEach((track) => {
        track.stop();
      });    

      transport.close();
      producer.close();

      const msg = JSON.stringify({
        type:"broadcaster-closed",
        producerId:producer.id
      }); 
      socket.send(msg);
      Navigate("/")
    }

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
              socket.send(JSON.stringify({type:"try1"}));
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

    const changeStream = (stream:MediaStream)=>{
      const videotrack = stream.getVideoTracks()[0];
      const audiotrack = stream.getAudioTracks()[0];

      producer.replaceTrack({track:videotrack});
      producer.replaceTrack({track:audiotrack});
      videoElemnt.srcObject = stream;
      videoElemnt.play();

      setVideo([videotrack,true]);
      setAudio([audiotrack,true]);
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

    const audiohandler = ()=>{
      if(audios?.[1]){
        audios[0].enabled = false;
      }else if(audios?.[1] == false){
        audios[0].enabled = true;
      }

    }

    const videohandler = ()=>{
      if(videos){
        videos[0].enabled = false;
      }
    }

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


    const onProducerTransportCreated = async (event:any):Promise<void> => { 
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
     
        try{
          stream = await getUserMedia();
          console.log("this is stream : ",stream);
          videoElemnt = document.getElementById('local_stream') as HTMLVideoElement;
          videoElemnt.srcObject = stream || null;
          videoElemnt.muted = true;
          videoElemnt.play();
          
          
          const videoTrack = stream?.getVideoTracks()[0];
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

          
      return(<div className="group">
        <div className="flex flex-row w-full h-full ">
            <video hidden className="border-2 w-5xl h-full " id="local_stream" controls autoPlay></video>
            <div hidden className="border-2 w-2xl border-amber-950" id="chat"></div>
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
                    <div onClick={audiohandler}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
                        </svg> : <div></div>
                    </div>
                    <div onClick={videohandler}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                        </svg>:<div></div>
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