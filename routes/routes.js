import express from "express";

import { tgDisplay, display404, display500 } from "../controllers/display-controller.js";
import { tgCommandControl } from "../controllers/data-controller.js";

const router = express.Router();

//tg command sumbit
router.post("/tg-submit-route", tgCommandControl);

//tg display route
router.get("/", tgDisplay);

router.use(display404);

router.use(display500);

export default router;
