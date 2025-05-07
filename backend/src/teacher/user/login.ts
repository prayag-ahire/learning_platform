import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken"
const router = Router();
const prisma = new PrismaClient();

router.post('/login',async (req:Request,res:Response):Promise<any>=>{

    const {email,password} = req.body

    console.log(email,password);
    try{
        const user = await prisma.teacher.findFirst({
            where:{
                email
            }
        })
        console.log(user);
        if(!user){
            return res.status(400).json({message:"Invalid credintials ! user not exitst"});
        }
        const match = await bcrypt.compare(password,user.password);

        console.log(match);
        if(!match){
            return res.status(400).json({message:"Invalid credintials"});
        }
        const token = jwt.sign({id:user.id},"this",{expiresIn:'7d'});

        res.json({token:token});
        console.log(token);

      
    }catch(error){
        console.error(error,"something wrong with users cradintiols");
        res.status(500).json({message:"server error"});
    }
})

export default router;