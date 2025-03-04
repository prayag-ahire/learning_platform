import { PrismaClient } from "@prisma/client";
import { Router } from "express";

const router = Router();
const prisma = new PrismaClient();

router.post('/signup',(req,res)=>{
    try{

    }catch(error){
        console.error(error,"something worong");
    }
})

export default router;