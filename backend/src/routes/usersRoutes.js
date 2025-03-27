import { PrismaClient } from '@prisma/client';
import { Router } from 'express';

const router = Router();
const prisma = new PrismaClient()


router.get('/',(req,res)=>{
   
})


export default router;