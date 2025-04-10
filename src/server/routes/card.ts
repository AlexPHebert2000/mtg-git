import { Router } from "express";
import { PrismaClient } from "../../../generated/prisma/index.js";
import type { Request, Response } from "express";
import axios from "axios";
import type { ScryfallCard } from "../types.js";
import type { Card } from "../../../generated/prisma/index.js";

const card = Router();
const prisma = new PrismaClient();

card.get("/search", async (req: Request, res: Response) => {
  try{
    const { q } = req.query;
    console.log(req.query)
    const searchResults = await axios.get(`https://api.scryfall.com/cards/search?q=${q}`);
    const dbCards = await Promise.allSettled(searchResults.data.data.map((card :ScryfallCard) => (
      prisma.card.findUnique({
        where: {id: card.id},
        include: {faces: true}
      })
    )));
    res.send(dbCards.map((card: PromiseSettledResult<Card>) => card.value));
  }
  catch (e) {
    console.error((e as Error).message);
    res.sendStatus(500);
  }
  finally{
    prisma.$disconnect();
  }

});

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