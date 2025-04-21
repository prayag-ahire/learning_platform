import { PrismaClient } from "@prisma/client";
import { Router } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"

const router = Router();
const prisma = new PrismaClient();



router.post("/live",async(req,res)=>{
    const token = req.body.token;
    const user = jwt.verify(token,"this");
    const stid = (user as JwtPayload).id;
    try{
        const user = await prisma.student.findMany({
          where:{
            id:stid
          },select:{
            teacher:{
                where:{
                    teacher:{
                        live:true
                    }
                },
                select:{
                    teacher:{
                        select:{
                             name:true,
                             room:true,
                             id:true,
                        }
                    }
                }
               
            }
          }
            
        })
        console.log(user);
        res.json({"mesg":user});
    }catch(error){
        console.log(error,"something wrong");
    }
})

export default router;