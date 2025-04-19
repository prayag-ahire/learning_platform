import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";
import jwt,{JwtPayload} from "jsonwebtoken"

const router = Router();
const prisma = new PrismaClient();

router.post('/joinstudent',async(req:Request,res:Response)=>{
    try{
        const {token} = req.body;
        const nans = jwt.verify(token,"this" );
        const ans = (nans as JwtPayload).id;
        console.log(ans);
        const user = await prisma.teacher.findFirst({
            where:{
                id:ans
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