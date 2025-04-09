import { Router } from "express";
import bulk from "./routes/bulk.js";

const router = Router();

router.use("/bulk", bulk);

export default router;