import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (requestAnimationFrame, res) => {
    const { VideoId } = req.params;
    const { page = 1, limit = 10 } = req.query;
})

const addComment = asyncHandler(async (req, res) => {
    const { VideoId } = req.params;
    const { content, parentCommentId } = req.body;
    const userId = req.user._id;

    if (parentCommentId) {
        const parentComment = await Comment.findById(parentCommentId);
        if (!parentComment) {
            throw new ApiError(404, 'Parent Comment no found');
        }
    }

    const newComment = new Comment({
        video: VideoId,
        user: userId,
        content,
        parentComment: parentCommentId || null
    })

    await newComment.save();

    return res
        .status(201)
        .json(new ApiResponse(201, 'Comment added Successfully', newComment));
})

const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, 'Comment not found');
    }

    if (comment.user.toString() !== userId.toString()) {
        throw new ApiError(403, 'You are not authorized to update this comment');
    }

    comment.content = content;

    await comment.save();

    return res
        .status(200)
        .json(new ApiResponse(200, 'Comment updated Successfully', comment));
})

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user._id;
    const isAdmin = req.user.role === 'admin';

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, 'Comment not found');
    }

    if (comment.user.toString() !== userId.toString() && !isAdmin) {
        throw new ApiError(403, 'You are not authorized to delete this comment');
    }

    await comment.remove();

    return res
        .status(200)
        .json(new ApiResponse(200, 'Comment deleted Successfully'));
})

const likeComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, 'Comment not found');
    }

    if (comment.likes.includes(userId)) {
        throw new ApiError(400, 'You have already liked this comment');
    }

    comment.likes.push(userId);

    await comment.save();

    return res
        .status(200)
        .json(new ApiResponse(200, 'Comment Liked Successfully', comment));
})

const unlikeComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, 'Comment not found');
    }

    if (!comment.likes.includes(userId)) {
        throw new ApiError(400, 'You have not liked this comment');
    }

    comment.likes = comment.likes.filter(id => id.toString() !== userId.toString());

    await comment.save();

    return res
        .status(200)
        .json(new ApiResponse(200, 'Comment Unliked Successfully', comment));
})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment,
    likeComment,
    unlikeComment
}