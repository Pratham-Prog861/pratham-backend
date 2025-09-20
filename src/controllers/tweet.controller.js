import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet

    if(!isValidObjectId(req.user._id)) {
        throw new ApiError(400, 'Invalid User ID');
    }

    const tweet = new Tweet({
        text : req.body.text,
        user : req.user._id,
        likes : 0,
        comments : [],
        isPublic : true,
    })

    if(!tweet) {
        throw new ApiError(400, 'Failed to create Tweet');
    }

    await tweet.save();

    return res
    .status(201)
    .json(new ApiResponse(201, 'Tweet created Successfully', tweet));
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets

    if(!isValidObjectId(req.user._id)) {
        throw new ApiError(400, 'Invalid User ID');
    }

    const tweets = await Tweet.find({user : req.user._id});

    if(!tweets) {
        throw new ApiError(404, 'No Tweets Found');
    }

    return res
    .status(200)
    .json(new ApiResponse(200, 'Tweets Fetched Successfully', tweets));
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet

    if(!isValidObjectId(req.user._id)) {
        throw new ApiError(400, 'Invalid User ID');
    }

    const tweet = await Tweet.findById(req.params.tweetId);

    if(!tweet) {
        throw new ApiError(404, 'Tweet not found');
    }

    if(tweet.user.toString() !== req.user._id.toString()) {
        throw new ApiError(401, 'Unauthorized');
    }

    tweet.text = req.body.text;

    await tweet.save();

    return res
    .status(200)    
    .json(new ApiResponse(200, 'Tweet Updated Successfully', tweet));
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet

    if(!isValidObjectId(req.user._id)) {
        throw new ApiError(400, 'Invalid User ID');
    }

    const tweet = await Tweet.findById(req.params.tweetId);

    if(!tweet) {
        throw new ApiError(404, 'Tweet not found');
    }

    if(tweet.user.toString() !== req.user._id.toString()) {
        throw new ApiError(401, 'Unauthorized');
    }

    await tweet.remove();

    return res
    .status(200)
    .json(new ApiResponse(200, 'Tweet Deleted Successfully'));
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}