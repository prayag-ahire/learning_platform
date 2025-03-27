import { PrismaClient } from "@prisma/client";
import { Router } from "express";

const router = Router();
const prisma = new PrismaClient();

router.post('/endclass',(req,res)=>{
    try{

    }catch(error){
        console.error(error,"something wrong")
    }
})

export default router;