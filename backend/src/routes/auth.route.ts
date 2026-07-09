// routes/auth.route.ts
import { Router } from "express";
import { syncUser } from "../controllers/auth.controller";

const router = Router();

router.post("/sync", syncUser);

export default router;