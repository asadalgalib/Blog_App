import { Request, Response } from "express";
import { commentServices } from "./services";
import { UserRole } from "../../middleware/authorize";

const getSignleComment = async (req: Request, res: Response) => {
    try {
        const { commentId } = req.params;
        if (!commentId) {
            return res.status(400).json({
                message: "Comment ID required",
                details: "Invalid Id"
            })
        }
        const result = await commentServices.getSignleComment(commentId);
        return res.status(200).json(result)
    } catch (error: any) {
        return res.status(400).json({
            message: "Something went wrong",
            error: error
        })
    }
}

const getAuthorComment = async (req: Request, res: Response) => {
    try {
        const { authorId } = req.params;
        if (!authorId) {
            return res.status(400).json({
                message: "Author ID required",
                details: "Invalid Id"
            })
        }
        const isAuthor = req.user?.id === authorId;
        const isAdmin = req.user?.role === "ADMIN";

        if (isAdmin || isAuthor) {
            const result = await commentServices.getAuthorComment(authorId);
            return res.status(200).json(result)
        }
        console.log(authorId);
        return res.status(403).json({
            message: "You don't have permission",
            error: "Forbidden Request"
        })

    } catch (error: any) {
        return res.status(400).json({
            message: "Something went wrong",
            error: error
        })
    }
}


const createComment = async (req: Request, res: Response) => {
    try {
        const authorId = req.user?.id as string;
        const result = await commentServices.createComment(req.body, authorId);
        return res.status(201).json(result)
    } catch (error: any) {
        return res.status(400).json({
            message: "Something went wrong",
            error: error
        })
    }
}

// * Delete Comment
const deleteComment = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        const { commentId } = req.params;
        const result = await commentServices.deleteComment(commentId as string, user?.id as string)
        res.status(200).json(result)
    } catch (e) {
        console.log(e)
        res.status(400).json({
            error: "Comment delete failed!",
            details: e
        })
    }
}

// * Update Comment
const updateComment = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        const { commentId } = req.params;
        const result = await commentServices.updateComment(commentId as string, req.body, user?.id as string)
        res.status(200).json(result)
    } catch (e) {
        console.log(e)
        res.status(400).json({
            error: "Comment update failed!",
            details: e
        })
    }
}

export const commentControler = {
    getSignleComment,
    getAuthorComment,
    createComment,
    deleteComment,
    updateComment
}