import { Request, Response } from "express";
import { postServices } from "./services";

const getPost = async (req: Request, res: Response) => {
    try {
        const { search } = req.query;
        const searchString = typeof search === "string" ? search : undefined
        const tags = req.query.tags ? (req.query.tags as string).split(",") : []
        const result = await postServices.getPost({ search: searchString, tags });
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
                message: "Bad request",
                details: "Invalid Id"
            })
        }
        const result = await postServices.getSinglePost(id);
        res.status(201).json(result)
    } catch (error: any) {
        res.status(400).json({
            message: error.message
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