import { Router } from "express";
import authorize, { UserRole } from "../../middleware/authorize";
import { commentControler } from "./controler";

const router = Router();

// * Get single comment
router.get(
    "/:commentId",
    authorize(UserRole.ADMIN, UserRole.USER),
    commentControler.getSignleComment
)

// * Get Author comment
router.get(
    "/author/:authorId",
    authorize(UserRole.ADMIN, UserRole.USER),
    commentControler.getAuthorComment
)

// * Create Comment
router.post(
    "/",
    authorize(UserRole.ADMIN, UserRole.USER),
    commentControler.createComment
);

// * Delete Comment
router.delete(
    "/:commentId",
    authorize(UserRole.ADMIN, UserRole.USER),
    commentControler.deleteComment
);

// * update comment
router.patch(
    "/:commentId",
    authorize(UserRole.USER, UserRole.ADMIN),
    commentControler.updateComment
)

export const commentRoutes = router;