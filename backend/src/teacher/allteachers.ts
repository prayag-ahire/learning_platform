import { PrismaClient } from "@prisma/client";
import { Router } from "express";

const router = Router();
const prisma = new PrismaClient();


router.get("/allteacher", async (req, res) => {

    console.log("GET /allteacher hit"); 
    try {
        const teachers = await prisma.teacher.findMany();
        res.status(200).json({ teachers });
    } catch (error) {
        console.error("Error fetching teachers:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
export default router;
