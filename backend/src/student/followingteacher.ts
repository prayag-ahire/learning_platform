import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"

const router = Router();
const prisma = new PrismaClient();

router.post('/subscribe',async(req,res)=>{
    try{
        const {teacherid,token} = req.body;
        const nans = jwt.verify(token,"this");
        const studentid = (nans as JwtPayload).id;
        console.log(teacherid,studentid);

        const ts = await  prisma.studentTeacher.create({
            data:{
                student:{connect:{id:studentid}},
                teacher:{connect:{id:teacherid}}
            },
            select:{
                student:true,
                teacher:true
            }
        })
        res.json({"ts":ts})
    }catch(error){
        console.log(error);
        res.status(401).json({"message":"subscribe failed"});
    }
})

router.post("/jointeacher",async(req,res)=>{
    const token = req.body;
    console.log(token);
    const use = jwt.verify(token.token,"this");
    const stid = (use as JwtPayload).id;
    const user = await prisma.student.findFirst({
        where:{
            id:stid
        }
        ,select:{
            name:true,
            teacher:{
                select:{
                    teacher:{
                        select:{
                            name:true,
                            id:true
                        }
                    }
                }
            }
        }
    })

    res.json({"message":user});
})

export default  router;