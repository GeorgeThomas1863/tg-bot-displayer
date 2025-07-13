import express from "express";

import { tgDisplay, display404, display500 } from "../controllers/display.js";
import { tgCommandParse } from "../controllers/command.js";

const router = express.Router();

//tg display route
router.get("/", tgDisplay);

//tg command sumbit
router.post("/tg-submit-route", tgCommandParse);

router.use(display404);

router.use(display500);

export default router;
