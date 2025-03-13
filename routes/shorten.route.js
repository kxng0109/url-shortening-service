import { Router } from "express";
import { createShort, deleteShort, getShort, getShortStat, updateShort } from "../controllers/shorten.controller.js";
import removeSlash from "../middlewares/removeSlash.js";
import shortChecker from "../middlewares/shortChecker.middleware.js";

const router = Router();

router.route("/:shortCode/stats").get(removeSlash, getShortStat);
router.route("/*").get(removeSlash, getShort).patch(removeSlash, updateShort).delete(removeSlash, deleteShort);
router.route("/").post(removeSlash, createShort);

export default router;