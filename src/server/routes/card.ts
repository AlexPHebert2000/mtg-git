import { Router } from "express";
import { PrismaClient } from "../../../generated/prisma/index.js";
import type { Request, Response } from "express";

const card = Router();
const prisma = new PrismaClient();

card.get("/:id", async (req: Request, res: Response) => {
  const {id} = req.params;
  try{
    const retrieved = await prisma.card.findUnique({
      where: {id},
      include: {faces: true}
    });
    res.send(retrieved);
  }
  catch{(e: Error) => {
    console.error(e.message);
  }}
  finally{() => {
    prisma.$disconnect();
  }}
});

export default card;