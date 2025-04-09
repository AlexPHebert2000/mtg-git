import { Router } from "express";
import type { Request, Response } from "express";
import axios from "axios";
import { PrismaClient } from "../../../generated/prisma/index.js";

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

interface ScryfallCard {
  arena_id : number | null,
  id: string,
  land: string,
  mtgo_id: number | null,
  mtgo_foil_id: number | null,
  multiverse_ids: number[] | null,
  tcgplayer_id: number | null,
  tcgplayer_etched_id: number | null,
  cardmarket: number | null,
  object: "card",
  layout: string,
  oracle_id: string | null,
  prints_search_uri: string,
  rulings_uri: string,
  scryfall_uri: string,
  uri: string,
  all_parts: RelatedCardObject[] | null,
  card_faces: CardFaceObject[] | null,
  cmc: number,
  color_identity: string,
  color_indicator: string | null,
  colors: string | null,
  defense: string | null,
  edhrec_rank: number | null,
  game_changer: boolean | null,
  hand_modifier: string | null,
  keywords: string[],
  legalities: {
    "standard": "legal"| "not legal" | "banned" | "restricted",
    "future": "legal"| "not legal" | "banned" | "restricted",
    "historic": "legal"| "not legal" | "banned" | "restricted",
    "timeless": "legal"| "not legal" | "banned" | "restricted",
    "gladiator": "legal"| "not legal" | "banned" | "restricted",
    "pioneer": "legal"| "not legal" | "banned" | "restricted",
    "explorer": "legal"| "not legal" | "banned" | "restricted",
    "modern": "legal"| "not legal" | "banned" | "restricted",
    "legacy": "legal"| "not legal" | "banned" | "restricted",
    "pauper": "legal"| "not legal" | "banned" | "restricted",
    "vintage": "legal"| "not legal" | "banned" | "restricted",
    "penny": "legal"| "not legal" | "banned" | "restricted",
    "commander": "legal"| "not legal" | "banned" | "restricted",
    "oathbreaker": "legal"| "not legal" | "banned" | "restricted",
    "standardbrawl": "legal"| "not legal" | "banned" | "restricted",
    "brawl": "legal"| "not legal" | "banned" | "restricted",
    "alchemy": "legal"| "not legal" | "banned" | "restricted",
    "paupercommander": "legal"| "not legal" | "banned" | "restricted",
    "duel": "legal"| "not legal" | "banned" | "restricted",
    "oldschool": "legal"| "not legal" | "banned" | "restricted",
    "premodern": "legal"| "not legal" | "banned" | "restricted",
    "predh": "legal"| "not legal" | "banned" | "restricted"
  },
  life_modifier: string | null,
  loyalty: string | null,
  mana_cost: string | null,
  name: string,
  oracle_text: string | null,
  penny_rank: number | null,
  power: string | null,
  produced_mana: string,
  reserved: boolean,
  toughness: string | null,
  type_line: string,
  artist: string | null,
  artist_ids: string[] | null,
  attraction_lights: number[] | null,
  booster: boolean,
  border_color: string,
  card_back_id: string,
  collector_number: string,
  content_warning: boolean | null,
  digital: boolean,
  finishes: string[],
  flavor_name: string | null,
  flavor_text: string | null,
  frame_effects: string[] | null,
  frame: string,
  full_art: boolean,
  games: string[],
  highres_image: boolean,
  illustration_id: string | null,
  image_status: string,
  image_uris:{
    png: string | null,
    border_crop: string | null,
    art_crop: string | null,
    large: string | null,
    normal: string | null,
    small: string | null
  },
  oversized: boolean,
  prices: {
    usd: string | null,
    usd_foil: string | null,
    usd_etched: string | null,
    eur: string | null,
    eur_foil: string | null,
    eur_etched: string | null,
    tix: string | null
  },
  printed_name: string | null,
  printed_text: string | null,
  printed_typeline: string | null,
  promo: boolean,
  promo_types: string[] | null,
  purchase_uris:{
    tcgplayer: string | null,
    cardmarket: string | null,
    cardhoarder: string | null,
    cardkingdom: string | null
  } | null,
  rarity: string,
  related_uris: {
    "gatherer": string,
    "tcgplayer_infinite_articles": string,
    "tcgplayer_infinite_decks": string,
     "edhrec": string
  },
  released_at: string,
  reprint: boolean,
  scryfall_set_uri: string,
  set_name: string,
  set_search_uri: string,
  set_type: string,
  set_uri: string,
  set: string,
  set_id: string,
  story_spotlight: boolean,
  textless: boolean,
  variation: boolean,
  variation_of: string | null,
  security_stamp: string | null,
  watermark: string | null,
  "preview.previewed_at": string | null,
  "preview.source_uri": string | null,
  "preview.source": string | null
};

interface RelatedCardObject{
  id: string,
  object: "related_card",
  component: "token" | "meld_part" | "meld_result" | "combo_piece",
  name: string,
  type_line: string,
  uri: string
};
interface CardFaceObject{
  artist: string | null,
  artist_id: string | null,
  cmc: number | null,
  color_indicator: string | null,
  colors: string | null,
  defense: string | null,
  flavor_text: string | null,
  illustration_id: string | null,
  image_uris:{
    png: string | null,
    border_crop: string | null,
    art_crop: string | null,
    large: string | null,
    normal: string | null,
    small: string | null
  },
  layout: string | null,
  loyalty: string | null,
  mana_cost: string,
  name: string,
  object: "card_face",
  oracle_id: string | null,
  oracle_text: string | null,
  power: string | null,
  printed_name: string | null,
  printed_text: string | null,
  printed_type_line: string | null,
  toughness: string | null,
  type_line: string | null,
  watermark: string | null
};

export default bulk;