import { COMMENT, Comment } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

// * Get comment by ID
const getSignleComment = async (id: string) => {
    const result = await prisma.comment.findUnique({
        where: {
            id: id
        },
        include: {
            post: true
        }
    })
    return result;
}
// * Get comment by Author
const getAuthorComment = async (id: string) => {
    console.log(id);
    const result = await prisma.comment.findMany({
        where: {
            authorId: id
        },
        orderBy: { createdAt: "desc" },
        include: {
            post: {
                select: {
                    id: true,
                    title: true
                }
            }
        }
    })

    const commentCount = await prisma.comment.count({
        where: {
            authorId: id
        }
    })
    return {
        data: result,
        count: commentCount
    };
}
// * Create comment 
const createComment = async (commentData: Comment, authorId: string) => {
    await prisma.post.findUniqueOrThrow({
        where: {
            id: commentData.postId
        }
    });
    if (commentData.parentId) {
        await prisma.comment.findUniqueOrThrow({
            where: {
                id: commentData.parentId
            }
        })
    }
    const result = await prisma.comment.create({
        data: {
            ...commentData,
            authorId
        }
    });
    console.log(result);
    return result;
}

// * Delete Comment
const deleteComment = async (commentId: string, authorId: string) => {
    const commentData = await prisma.comment.findFirst({
        where: {
            id: commentId,
            authorId
        },
        select: {
            id: true
        }
    })

    if (!commentData) {
        throw new Error("Your provided input is invalid!")
    }

    const result = await prisma.comment.delete({
        where: {
            id: commentData.id
        }
    })

    return {
        success: true,
        deleted: result
    }
}
// * Update comment
const updateComment = async (commentId: string, data: { content?: string, status?: COMMENT }, authorId: string) => {
    const commentData = await prisma.comment.findFirst({
        where: {
            id: commentId,
            authorId
        },
        select: {
            id: true
        }
    })

    if (!commentData) {
        throw new Error("Your provided input is invalid!")
    }

    const result = await prisma.comment.update({
        where: {
            id: commentId,
            authorId
        },
        data
    })
    return {
        success: true,
        data: result
    }
}

export const commentServices = {
    getSignleComment,
    getAuthorComment,
    createComment,
    deleteComment,
    updateComment
}