import express from "express";

import { tgDisplay, display404, display500 } from "../controllers/display.js";
import { tgCommandControl } from "../controllers/command.js";

const router = express.Router();

//tg display route
router.get("/", tgDisplay);

//tg command sumbit
router.post("/tg-submit-route", tgCommandControl);

router.use(display404);

router.use(display500);

export default router;
