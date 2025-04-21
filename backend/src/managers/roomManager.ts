
import { Transport } from "mediasoup/node/lib/TransportTypes";
import { createWorker } from "../lib/worker";
import { Room } from "./room";
import { Producer } from "mediasoup/node/lib/ProducerTypes";
import { Consumer } from "mediasoup/node/lib/ConsumerTypes";




export class RoomManager{

    private rooms:Map<string,Room>

    constructor(){
        this.rooms = new Map();
    }

    async createRoom(roomId:string):Promise<Room>{
        if(this.rooms.has(roomId)){
            throw new Error("room already exist")
        }

        const router = await createWorker();
        const room = new Room(roomId,router);
        this.rooms.set(roomId,room);
        return room;
    }

    

    getRoom(roomId:string):Room | undefined{
        return this.rooms.get(roomId);
    }


    getRoomRouter(roomId:string){
        // console.log(roomId);
        const room = this.rooms.get(roomId);
        // console.log("this is room - ",room);
        return room?.getRouter();
    }



    getProducer(roomId:string){
        const room = this.rooms.get(roomId);      
        return room?.getProducer();
    }

    setProducer(roomId:string,producer:Producer){
        const room = this.rooms.get(roomId);
        return room?.setProducer(producer)
    }


    getConsumer(roomId:string,id:string){
        const room = this.rooms.get(roomId);
        return room?.getConsumer(id);
    }

    setConsumer(roomId:string,id:string,consumer:Consumer[]){
        const room = this.rooms.get(roomId);
        return room?.setConsumer(id,consumer);
    }

    setProducerTransport(roomId:string,transport:Transport){
        const room = this.rooms.get(roomId);
        room?.setProducerTransport(transport);
    }

    setConsumerTransport(roomId:string,transport:Transport){
        const room = this.rooms.get(roomId);
        room?.setConsumerTransport(transport);
    }

    getConsumerTransport(roomId:string){
        const room = this.rooms.get(roomId);
        return room?.getConsumerTransport();        
    }

    getProducerTransport(roomId:string){
        // console.log("this is inner class getproducertransport",roomId);
        const room = this.rooms.get(roomId);
        // console.log("room is -", room);
        return room?.getProducerTransport();
    }

    getallconsumer(){
        const room = this.rooms.get("1");
        
        return room?.getallConsumer();
    }


    removeRoom(roomId:string):void{
       const room = this.rooms.get(roomId);
        if(room){
            room.close();
            this.rooms.delete(roomId);
        }
    }
}