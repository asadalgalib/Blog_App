import { Router } from "express";
import { postControler } from "./controler";

const router = Router();
// * Create Post
router.post("/", postControler.createPost);
// * Get post 
router.get("/",postControler.getPost)

export const postRoutes = router;