import { PrismaClient } from "@prisma/client";
import { Router } from "express";

const router = Router();
const prisma = new PrismaClient();

router.post('/login',(req,res)=>{
    const {email} = req.body
    try{
      
    }catch(error){
        console.error(error,"something wrong with users cradintiols")
    }
})

export default router;