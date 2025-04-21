import { Router } from "express";
import jwt,{JwtPayload} from "jsonwebtoken"
import { PrismaClient } from "@prisma/client";

const router = Router();

router.post("/me",async(req,res)=>{
    try{
        const token = req.body;
        console.log(token.tk);
        const lod = jwt.verify(token.tk,"this");
        const stid = (lod as JwtPayload).id;
        console.log(stid);

        const prisma = new PrismaClient();

        const user = await  prisma.teacher.findFirst({
            where:{
                id:stid
            }
           ,select:{
            name:true
           }
        });

        res.json({"message":user});
        console.log(user);

    }catch(error){
        console.error(error,"something wrong");
    }
})

export default router;