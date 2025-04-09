import { Router } from "express";
import bulk from "./routes/bulk.js";
import card from "./routes/card.js";

const router = Router();

router.use("/bulk", bulk);
router.use("/card", card);

export default router;