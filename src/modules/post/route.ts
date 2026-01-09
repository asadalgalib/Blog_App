import { Router } from "express";
import { postControler } from "./controler";
import authorize, { UserRole } from "../../middleware/authorize";

const router = Router();

// * Get post 
router.get("/", authorize(UserRole.ADMIN, UserRole.USER), postControler.getPost)
// * Get single post
router.get("/:id", authorize(UserRole.USER), postControler.getSinglePost)
// * Create Post
router.post("/", authorize(UserRole.ADMIN, UserRole.USER), postControler.createPost);

export const postRoutes = router;