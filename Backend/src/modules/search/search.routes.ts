import { Router } from "express";

import { searchAll } from "./search.controller";

const router = Router();

router.get("/", searchAll);

export default router;
