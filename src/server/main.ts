import express from "express";
import ViteExpress from "vite-express";
import router from "./router.js";

const app = express();

app.use("/api", router);

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);
