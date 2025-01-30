import { Router } from "express";
import { createRoom, getChats ,getSlug} from "../controllers/roomControllers";

const router: Router = Router();

router.post("/create", createRoom);

router.get("/get-chats/:roomId", getChats);

router.get("/get-slug/:slug",getSlug);

export default router;
