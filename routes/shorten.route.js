import { Router } from "express";
import { createShort, getShort } from "../controllers/shorten.controller.js";

const router = Router();

router.route("*").get(getShort);
router.route("/").post(createShort);

export default router;