import { Router } from "express";
import {
    createShort,
    deleteShort,
    getShort,
    getShortStat,
    updateShort,
} from "../controllers/shorten.controller.js";
import removeSlash from "../middlewares/removeSlash.js";
import shortCodeValidator from "../middlewares/shortCodeValidator.middleware.js";
import urlValidator from "../middlewares/urlValidator.middleware.js";

const router = Router();

router
	.route("/:givenShort/stats")
	.get(removeSlash, shortCodeValidator, getShortStat);

router.route("/:givenShort").get(removeSlash, shortCodeValidator, getShort);

router
	.route("/:givenShort")
	.patch(removeSlash, shortCodeValidator, urlValidator, updateShort)
	.delete(removeSlash, shortCodeValidator, deleteShort);
router.route("/").post(removeSlash, urlValidator, createShort);

export default router;
