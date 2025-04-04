import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import jwt from "jsonwebtoken"

const router = Router();
const prisma = new PrismaClient();

router.post('/joinstudent',async(req,res)=>{
    try{
        const {token} = req.body;
        const ans = jwt.verify(token,"this").id;
        console.log(ans);
        const user = await prisma.teacher.findFirst({
            where:{
                id:ans.id
            },
            select:{
                name:true,
               students:{
                select:{
                    student:{
                         select:{
                            name:true,
                            id:true
                         }
                    }
                }
               }
            }
        })
        console.log(user);
        res.json({user});
    }catch(error){
        console.error(error,"something wrong");
    }
})

export default router;