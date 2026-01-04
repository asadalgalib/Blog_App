import { Request, Response } from "express";
import { postServices } from "./services";

const createPost = async (req: Request, res: Response) => {
    try {
        const result = await postServices.createPost(req.body);
        res.status(201).json(result)
    } catch (error: any) {
        res.status(400).json({
            message: error.message
        })
    }
}

const getPost = async (req: Request, res: Response) => {
    try {
        const result = await postServices.getPost();
        res.status(201).json(result)
    } catch (error: any) {
        res.status(400).json({
            message: error.message
        })
    }
}

export const postControler = {
    createPost,
    getPost
}