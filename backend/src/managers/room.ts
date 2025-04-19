import { Consumer } from "mediasoup/node/lib/ConsumerTypes";
import { Producer } from "mediasoup/node/lib/ProducerTypes";
import { Router } from "mediasoup/node/lib/RouterTypes";
import { Transport } from "mediasoup/node/lib/TransportTypes";

export class Room {

    private id:string;
    private router:Router;
    private producer:Producer[];
    private producerTransport?:Transport;
    private consumer:Map<string,Consumer[]>;
    private consumerTransport?:Transport;


    constructor(id:string,router:Router){
        this.id = id,
        this.router = router,
        this.consumer = new Map();
        this.producer = [];
    }

    getallConsumer(){
        console.log("this is producer",this.producer);
        console.log("this is allconsumer",this.consumer);
        return this.consumer;
    }

    setProducer(producer:Producer){
        // console.log("this is producer from prarmters -----------",producer);
        this.producer.push(producer);
        // console.log("This is producer form room class -----------------",this.producer);
    }


    getProducer(){
        console.log(this.producer);
        return this.producer;
    }

    setConsumer(id:string,consumer:Consumer[]){
        this.consumer.set(id,consumer);
    }

    getConsumer(id:string){
        return this.consumer.get(id);
    }



    setProducerTransport(transport:Transport){
        this.producerTransport = transport;
        
    }

    setConsumerTransport(transport:Transport){
        this.consumerTransport = transport;
    }

    getProducerTransport(){
        
        return this.producerTransport;
    }

    getConsumerTransport(){
        return this.consumerTransport;
    }

    addConsumer(consumerId:string,consumer:Consumer[]){
        this.consumer.set(consumerId,consumer); 
    }

    removeConsumer(consumerId:string){
        this.consumer.delete(consumerId);
    }

    getRouter(){
        return this.router;
    }

    close(){
        this.consumer.forEach((x)=>x.map((c)=>c.close()));
        this.router.close();
        console.log("room close");
    }
    
}