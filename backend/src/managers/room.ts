import { Consumer } from "mediasoup/node/lib/ConsumerTypes";
import { Producer } from "mediasoup/node/lib/ProducerTypes";
import { Router } from "mediasoup/node/lib/RouterTypes";
import { Transport } from "mediasoup/node/lib/TransportTypes";

export class Room {

    private id:string;
    private router:Router;
    private producer?:Producer;
    private producerTransport?:Transport;
    private consumer:Map<string,Consumer>;
    private consumerTransport?:Transport;

    constructor(id:string,router:Router){
        this.id = id,
        this.router = router,
        this.consumer = new Map();
    }

    setProducer(producer:Producer){
        if(this.producer){
            throw new Error("producer already exist in this room");
        }
        this.producer = producer;
    }

    getProducer(){
        console.log(this.producer);
        return this.producer;
    }

    setConsumer(id:string,consumer:Consumer){
        this.consumer.set(id,consumer);
    }

    getConsumer(id:string){
        return this.consumer.get(id);
    }



    setProducerTransport(transport:Transport){
        this.producerTransport = transport;
        // console.log("this is producertransport from class set",this.producerTransport);
    }

    setConsumerTransport(transport:Transport){
        this.consumerTransport = transport;
    }

    getProducerTransport(){
        // console.log("this producertransport from class get",this.producerTransport);
        return this.producerTransport;
    }

    getConsumerTransport(){
        return this.consumerTransport;
    }

    addConsumer(consumerId:string,consumer:Consumer){
        this.consumer.set(consumerId,consumer); 
    }

    removeConsumer(consumerId:string){
        this.consumer.delete(consumerId);
    }

    getRouter(){
        return this.router;
    }

    close(){
        this.consumer.forEach((x)=>x.close());
        this.router.close();
        console.log("room close");
    }
    
}