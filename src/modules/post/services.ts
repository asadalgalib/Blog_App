import { COMMENT, POST, Post } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const getPost = async ({
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
}: {
    search: string | undefined,
    tags: string[] | [],
    isFeatured: boolean | undefined,
    status: POST | undefined,
    authorId: string | undefined,
    page: number,
    limit: number,
    skip: number | undefined,
    sortBy: string
    sortOrder: string
}) => {
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
    if (typeof isFeatured === "boolean") {
        andConditions.push({
            isFeatured
        })
    }
    if (status) {
        andConditions.push({
            status
        })
    }
    if (authorId) {
        andConditions.push({
            authorId
        })
    }
    const result = await prisma.post.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: {
            AND: andConditions
        },
        orderBy: {
            [sortBy]: sortOrder
        },
        include: {
            _count: {
                select: {
                    comments: true
                }
            }
        }
    });
    
    const totalData = await prisma.post.count({
        where: {
            AND: andConditions
        }
    })
    const totalPage = Math.ceil(totalData / limit);

    return {
        data: result,
        pagination: {
            totalData,
            page,
            limit,
            totalPage
        }
    }
}

const getSinglePost = async (id: string) => {
    // * Transaction 
    const result = await prisma.$transaction(async (p) => {
        // * Update view count 
        await p.post.update({
            where: {
                id: id
            },
            data: {
                views: {
                    increment: 1
                }
            }
        })
        // * Get singlePost
        const singlePost = await p.post.findUnique({
            where: {
                id: id
            },
            include: {
                comments: {
                    where: {
                        parentId: null,
                        status: COMMENT.APPROVED
                    },
                    orderBy: { createdAt: "desc" },
                    include: {
                        replies: {
                            where: {
                                status: COMMENT.APPROVED
                            },
                            orderBy: { createdAt: "asc" },
                            include: {
                                replies: {
                                    where: {
                                        status: COMMENT.APPROVED
                                    },
                                    orderBy: { createdAt: "asc" },
                                    include: {
                                        replies: {
                                            where: {
                                                status: COMMENT.APPROVED
                                            },
                                            orderBy: { createdAt: "asc" },
                                            include: {
                                                replies: {
                                                    where: {
                                                        status: COMMENT.APPROVED
                                                    },
                                                    orderBy: { createdAt: "asc" },
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        comments: true
                    }
                }
            }
        });

        return singlePost
    })
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