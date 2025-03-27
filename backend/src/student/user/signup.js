import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"



const router = Router();
const prisma = new PrismaClient();

 router.post('/signup',async (req,res) =>{

    const {name,email,password} = req.body

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password,salt);
    let student;

    try{
        const user = await prisma.student.findUnique({
            where:{
                email
            },
        })
        if(user){
            return res.status(400).json({email:"is already exist"})
        }
        else{
        student =  await prisma.student.create({
            data:{
                name,
                email,
                password : hash
            },
            select:{
                email:true
            }
        })
        }
        jwt.sign({email},"this",{
            expiresIn: '7d'
        },(err,token)=>{
            if(err) throw err;
            res.json({token});
            console.log(token);
        });

       


    }catch(error){
        console.error(error);
        res.status(500).send('server error')
    }
})

export default router