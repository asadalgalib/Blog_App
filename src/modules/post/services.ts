import { Post } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const getPost = async ({ search, tags }: { search: string | undefined, tags: string[] | [] }) => {
    const andConditions: PostWhereInput[] = [];
    if (search) {
        andConditions.push({
            OR: [
                {
                    title: {
                        contains: search as string,
                        mode: "insensitive"
                    }
                },
                {
                    content: {
                        contains: search as string,
                        mode: "insensitive"
                    }
                },
                {
                    tags: {
                        has: search as string
                    }
                }
            ]
        })
    }
    if (tags) {
        andConditions.push({
            tags: {
                hasEvery: tags
            }
        })
    }
    const result = await prisma.post.findMany({
        where: {
            AND: andConditions
        }
    });
    return result;
}

const getSinglePost = async (id: string) => {
    const result = await prisma.post.findMany({
        where: {
            id: id
        }
    });
    return result;
}

const createPost = async (data: Omit<Post, "id" | "createdAt" | "updatedAt" | "authorId">, userId: string) => {
    const result = await prisma.post.create({
        data: {
            ...data,
            authorId: userId
        }
    })
    return result;
}

export const postServices = {
    getPost,
    getSinglePost,
    createPost
}