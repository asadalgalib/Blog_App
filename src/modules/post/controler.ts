import { Request, Response } from "express";
import { postServices } from "./services";
import { POST } from "../../../generated/prisma/enums";
import paginationSortingHelper from "../../helper/paginationSortingHelper";

const getPost = async (req: Request, res: Response) => {
    try {
        // * Query
        const search = req.query.search as string | undefined;
        const tags = req.query.tags ? (req.query.tags as string).split(",") : []
        const isFeatured = req.query.isFeatured
            ? req.query.isFeatured === 'true'
                ? true : req.query.isFeatured === 'false'
                    ? false : undefined : undefined
        const status = req.query.status as POST | undefined;
        const authorId = req.query.authorId as string | undefined
        const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(req.query);
        // * Logic
        const result = await postServices.getPost({
            search,
            tags,
            isFeatured,
            status,
            authorId,
            page,
            limit,
            skip,
            sortBy,
            sortOrder
        });
        res.status(201).json(result)
    } catch (error: any) {
        res.status(400).json({
            message: error.message
        })
    }
}

const getSinglePost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                message: "Post ID required",
                details: "Invalid Id"
            })
        }
        const result = await postServices.getSinglePost(id);
        res.status(201).json(result)
    } catch (error: any) {
        res.status(400).json({
            message: "Something went wrong",
            error: error.message
        })
    }
}

const createPost = async (req: Request, res: Response) => {
    try {
        const result = await postServices.createPost(req.body, req.user?.id as string);
        res.status(201).json(result)
    } catch (error: any) {
        res.status(400).json({
            message: error.message
        })
    }
}

export const postControler = {
    getPost,
    getSinglePost,
    createPost
}