import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    // toggle like on video

    if(!isValidObjectId(videoId)) {
        throw new ApiError(400, 'Invalid Video ID');
    }

    const existingLike = await Like.findOne({ video : videoId , user : req.user._id});

    if(existingLike) {
        // If like already exists, remove it (unlike)
        await existingLike.remove();
        return res
        .status(200)
        .json(new ApiResponse(200, 'Video Unliked Successfully'));
    }

    // If like doesn't exist, create a new like
    const newLike = new Like({
        video : videoId,
        user : req.user._id  
    });

    await newLike.save();

    return res
    .status(200)
    .json(new ApiResponse(200, 'Video Liked Successfully'));
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    // toggle like on comment

    if(!isValidObjectId(commentId)) {
        throw new ApiError(400, 'Invalid Comment ID');
    }

    if(!isValidObjectId(req.user._id)) {
        throw new ApiError(400, 'Invalid User ID');
    }

    const existingLike = await Like.findOne({ comment : commentId , user : req.user._id});

    if(existingLike) {
        // If like already exists, remove it (unlike)
        await existingLike.remove();
        return res
        .status(200)
        .json(new ApiResponse(200, 'Comment Unliked Successfully'));
    }

    // If like doesn't exist, create a new like
    const newLike = new Like({
        comment : commentId,
        user : req.user._id  
    });

    await newLike.save();

    return res
    .status(200)
    .json(new ApiResponse(200, 'Comment Liked Successfully'));
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    // toggle like on tweet

    if(!isValidObjectId(tweetId)) {
        throw new ApiError(400, 'Invalid Comment ID');
    }

    if(!isValidObjectId(req.user._id)) {
        throw new ApiError(400, 'Invalid User ID');
    }

    const existingLike = await Like.findOne({ comment : tweetId , user : req.user._id});

    if(existingLike) {
        // If like already exists, remove it (unlike)
        await existingLike.remove();
        return res
        .status(200)
        .json(new ApiResponse(200, 'Tweet Unliked Successfully'));
    }

    // If like doesn't exist, create a new like
    const newLike = new Like({
        comment : tweetId,
        user : req.user._id  
    });

    await newLike.save();

    return res
    .status(200)
    .json(new ApiResponse(200, 'Tweet Liked Successfully'));    
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    // get all liked videos

    const likedVideos = await Like.find({ user : req.user._id, video : { $ne: null } }).populate('video');

    if(!likedVideos) {
        throw new ApiError(404 , 'No Liked Videos Found');
    }

    return res
    .status(200)
    .json(new ApiResponse(200, 'Liked Videos Fetches Successfully', likedVideos));
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}