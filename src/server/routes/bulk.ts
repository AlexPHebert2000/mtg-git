import { Router } from "express";
import type { Request, Response } from "express";
import axios from "axios";
import { PrismaClient } from "../../../generated/prisma/index.js";
import type {ScryfallCard} from "../types.js";
const bulk = Router();
const prisma = new PrismaClient();

bulk.patch("/refresh",(_: Request, res: Response) => {
  axios.get("https://api.scryfall.com/bulk-data/oracle-cards")
    .then(({data}) => {
      console.time("Download");
      return axios.get(data.download_uri);
    })
    .then(({data} : {data: ScryfallCard[]}) => {
      console.timeEnd("Download");
      data = data.filter((card) => card.layout !== "art_series");
      const chunkSize = 200;
      const numChunks = data.length / chunkSize;
      for (let i = 0; i < numChunks; i++) {
        const timerMsg = "Complete Chunk: " + i
        console.time(timerMsg);
        const chunk = data.slice(i * chunkSize, (i+1) * chunkSize);
        Promise.allSettled(chunk.map((card) => {
          if (card.card_faces){
            return prisma.card.upsert({
              where: {
                id: card.id
              },
              update: {
                usd: card.prices.usd ? card.prices.usd : null,
                usd_foil: card.prices.usd_foil ? card.prices.usd_foil : null,
                usd_etched: card.prices.usd_etched ? card.prices.usd_etched : null,
              },
              create: {
                id: card.id,
                name: card.name,
                scryfall_uri:card.uri,
                usd: card.prices.usd ? card.prices.usd : null,
                usd_foil: card.prices.usd_foil ? card.prices.usd_foil : null,
                usd_etched: card.prices.usd_etched ? card.prices.usd_etched : null,
                faces: {
                  createMany: {data: card.card_faces.map((face, i) => (
                    {
                      face_number: i,
                      name: face.name,
                      img : face.image_uris && face.image_uris.large ? face.image_uris.large : null
                    }
                  )) }
                }
              }
            })
          }
          else {
            return prisma.card.upsert({
              where: {
                id: card.id
              },
              update: {
                usd: card.prices.usd ? card.prices.usd : null,
                usd_foil: card.prices.usd_foil ? card.prices.usd_foil : null,
                usd_etched: card.prices.usd_etched ? card.prices.usd_etched : null,
              },
              create: {
                id: card.id,
                name: card.name,
                scryfall_uri:card.uri,
                usd: card.prices.usd ? card.prices.usd : null,
                usd_foil: card.prices.usd_foil ? card.prices.usd_foil : null,
                usd_etched: card.prices.usd_etched ? card.prices.usd_etched : null,
                img : card.image_uris && card.image_uris.large ? card.image_uris.large : null
              }
            })
          }
        }))
        .then(() => {
          console.timeEnd(timerMsg);
        })
      }
      res.sendStatus(200);
    })
    .catch((error) => {
      res.sendStatus(500);
      console.log(error)
    })
    .finally(() => {
      prisma.$disconnect();
    })
})

bulk.delete("", (_: Request, res: Response) => {
  prisma.cardFace.deleteMany({})
  .then(() => {
    return prisma.card.deleteMany({})
  })
  .then(() => {
    res.sendStatus(200);
  })
  .catch((e: Error)=>{
    console.log(e.message);
  })
  .finally(() => {
    prisma.$disconnect();
  })
});

export default bulk;