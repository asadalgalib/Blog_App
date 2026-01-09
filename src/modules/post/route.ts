import { Router } from "express";
import { postControler } from "./controler";
import authorize, { UserRole } from "../../middleware/authorize";

const router = Router();

// * Create Post
router.post("/", authorize(UserRole.ADMIN, UserRole.USER), postControler.createPost);
// * Get post 
router.get("/", authorize(UserRole.ADMIN, UserRole.USER), postControler.getPost)

export const postRoutes = router;