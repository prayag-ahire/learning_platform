import { Consumer, Producer, RtpCapabilities } from "mediasoup/node/lib/types.js";
import createWebRtcTransport from "./createWebRtcTransport.js";
import {v4} from "uuid";
import { WebSocket, WebSocketServer } from "ws";
import {RoomManager} from "../managers/roomManager.js"

let roomManger:RoomManager;
let genrateRoomId = 1;

export const webSocketConnection = async (websocket:WebSocketServer)=>{
    try{
       
        roomManger = new RoomManager();
    }catch(error){
        throw error;
    }
    websocket.on('connection',(ws:WebSocket)=>{
        (ws as any).id = v4();

        ws.on('message',(message:string)=>{

            const event = JSON.parse(message);
            console.log(event);
            switch(event.type){

                case "create-room":
                    const roomId = genrateRoomId++;
                    onCreateRoom(roomId.toString(),ws);
                    break;

                case 'getRouterRtpCapabilities':
                    onRouterRtpCapbilities(event,ws);
                    break;

                case 'createProducerTransport':
                    oncreateProducerTransport(event,ws);
                break;
                
                case 'connectProducerTransport':
                    onconnectProducerTransport(event,ws);
                break;

                case 'produce':
                    onProduce(event,ws,websocket);
                    // console.log("This is producer -------",roomManger.getProducer("1"));
                break;


                case 'createConsumerTransport':
                    oncreateconsumerTransport(event,ws);
                break;

                case 'connectConsumerTransport':
                    onconnectConsumerTransport(event,ws);
                break;

                case 'resume':
                    onResume(event,ws);
                    break;
                case 'consume':
                    onConsume(event,ws);
                    break;


                case 'broadcaster-closed':
                    console.log("hello this is consume", roomManger.getallconsumer());
                    onclose(event,websocket);
                    break;
                default:
                    break;
            }
        });
    });

    
    const onclose = (event:any,ws:WebSocketServer)=>{
        roomManger.removeRoom(event.roomId);
        brodcast(websocket,"closed","room closed by producer");
       
    }

    const onCreateRoom = async(roomId:string,ws:WebSocket)=>{
        await roomManger.createRoom(roomId);
        send(ws,"roomCreated",roomId);
        console.log(roomManger.getRoom(roomId));
    }

    const onRouterRtpCapbilities = (event:any, ws:WebSocket)=>{

        
        const router =   roomManger.getRoomRouter(event.roomId);
        console.log("this is router",router);
        console.log("this is router rtpcapabilities",router?.rtpCapabilities);

        send(ws,"routerCapabilities",router?.rtpCapabilities)
        console.log("get id :",(ws as any).id);

    }


    const oncreateProducerTransport= async(event:any,ws:WebSocket)=>{
        try{
            const router = roomManger.getRoomRouter(event.roomId);
            if(router){
                const { transport,params } = await createWebRtcTransport(router);

                roomManger.setProducerTransport(event.roomId,transport);
          
                send(ws,"ProducerTransportCreated",params);
            }

        }catch(error){
            console.error(error)
            send(ws,"error",error); 
        }
    }

    const  onconnectProducerTransport = async (event:any, ws:WebSocket) => {
        console.log("sender connected to server");
        const dtlsParameters = event.dtlsParameters;
        console.log("dtlsParameters : ",dtlsParameters);

        const producerTransport = roomManger.getProducerTransport(event.roomId);
        producerTransport?.connect({ dtlsParameters }); 

       
        console.log("producer transport : ",producerTransport);
        send(ws,'producerConnected','producer connted!');
      };
      

    const send = (ws:WebSocket,type:string,msg:any)=>{
        const message = {
            type,
            id:(ws as any).id,
            data:msg
        }
        const resp = JSON.stringify(message);
        ws.send(resp); 
    }

    const onResume = async(event:any,ws:WebSocket)=>{
        const consumer =  roomManger.getConsumer(event.id,event.roomId);
        await consumer?.map(x=>x.resume());
        send(ws,"resumed","resumed"); 
    }

    const onProduce =async (event:any,ws:WebSocket,WebSocket:WebSocketServer)=>{
            const { kind,rtpParameters} = event;
            const producerTransport = roomManger.getProducerTransport(event.roomId);
            console.log(producerTransport);
            const producer = await producerTransport?.produce({ kind,rtpParameters});
            console.log("this is producer",producer);
            if(producer){
                console.log("producer is here")
                roomManger.setProducer(event.roomId, producer);
                const res = {
                    id: producer.id,
                }
                
                 console.log("got produce!");
                 console.log("id : ",res.id);
                 console.log("server get IceCandidates : ",event); 
                 send(ws,'produced',res);
                 brodcast(WebSocket,'newProducer','new user');
            }
        }

    const brodcast = (ws:WebSocketServer,type:string,msg:any)=>{
        const message = {
            type,
            data:msg
        }
        const res= JSON.stringify(message);
        ws.clients.forEach((client)=>{
            client.send(res);
        })
    }
    
    const oncreateconsumerTransport = async(event:any,ws:WebSocket)=>{
        try{
            const router = roomManger.getRoomRouter(event.roomId);
            if(router){
                console.log("consumerTransport rtpCapabilites : ",event);
                const {transport,params} = await createWebRtcTransport(router);
                roomManger.setConsumerTransport(event.roomId,transport);
                send(ws,"subTransportCreated",params);
                console.log("params : ",params);
            }
        }catch(error){
            console.error(error);
        }
    }


    const onconnectConsumerTransport = async (event:any,ws:WebSocket)=>{

        const dtlsParameters = event.dtlsParameters;
        const consumerTransport = roomManger.getConsumerTransport(event.roomId);
        consumerTransport?.connect({ dtlsParameters})
        send(ws,"subConnected","consummer transport connected");   
    }



    const onConsume = async(event:any,ws:WebSocket)=>{

        console.log("this is onconsumer call ----------------");
        console.log(event.roomId);
        const producer =  roomManger.getProducer(event.roomId);
        console.log("this is producer",producer);
        if(producer){
            const res = await createConsumer(event.roomId,event.id, producer,event.rtpCapabilities);
            console.log("this is consumer");
            console.log(res);
            send(ws,"subscribed",res);
        }
    }

    const createConsumer = async (roomId:string,id:string,producer:Producer[],rtpCapabilities:RtpCapabilities)=>{
        

        const mediasoupRouter = roomManger.getRoomRouter(roomId) ;
        const consumerTransport = roomManger.getConsumerTransport(roomId);
        

        if(!mediasoupRouter || !consumerTransport) return

        const consumerPromise = producer.map(async(producer) => {   

            const conconsume = mediasoupRouter.canConsume({
            producerId: producer.id,
                rtpCapabilities,
        });

        if(!conconsume){
            console.error("can not consume this producer", producer.id) 
        }

        try{
            const consumer = await consumerTransport.consume({
                producerId: producer.id,
                rtpCapabilities,
                paused: false,
              });
        
            return consumer

        }catch (error) {
            console.error(' Consume failed:', error);
          }

        });

        const consumers = (await Promise.all(consumerPromise)).filter(Boolean) as Consumer[];

        if(consumers.length > 0){

            roomManger.setConsumer(roomId,id,consumers);
            
            return consumers.map((x)=>({
                producerId : x.id,
                id: x.id,
                kind: x?.kind,
                rtpParameters: x?.rtpParameters,
                type: x?.type,
                producerPaused: x?.producerPaused
            }))
        }
    }
}

export default webSocketConnection;
