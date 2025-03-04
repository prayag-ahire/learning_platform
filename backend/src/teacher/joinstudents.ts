import { PrismaClient } from "@prisma/client";
import { Router } from "express";

const router = Router();
const prisma = new PrismaClient();

router.get('/student',(req,res)=>{
    try{

    }catch(error){
        console.error(error,"something wrong");
    }
})