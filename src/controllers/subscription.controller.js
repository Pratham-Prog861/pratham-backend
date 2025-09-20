import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // toggle subscription

    if(!isValidObjectId(channelId)) {
        throw new ApiError(400, 'Invalid Channel ID');
    }

    if(!isValidObjectId(req.user._id)) {
        throw new ApiError(400, 'Invalid User ID');
    }

    const existingSubscription = await Subscription.findOne({ channel : channelId , subscriber : req.user._id});

    if(existingSubscription) {
        // If subscription already exists, remove it (unsubscribe)
        await existingSubscription.remove();
        return res
        .status(200)
        .json(new ApiResponse(200, 'Unsubscribed Successfully'));
    }

    // If subscription doesn't exist, create a new subscription

    const newSubscription = new Subscription({
        channel : channelId,
        subscriber : req.user._id
    })

    await newSubscription.save();

    return res
    .status(200)
    .json(new ApiResponse(200, 'Subscribed Successfully'));
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    if(!isValidObjectId(channelId)) {
        throw new ApiError(400, 'Invalid Channel ID');
    }

    const subscribers = await Subscription.find({ channel : channelId }).populate('subscriber', 'name email');

    if(!subscribers) {
        throw new ApiError(404, 'No Subscribers Found');
    }

    return res
    .status(200)
    .json(new ApiResponse(200, 'Subscribers Fetched Successfully', subscribers));
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    if(!isValidObjectId(subscriberId)) {
        throw new ApiError(400, 'Invalid Subscriber ID');
    }

    const subscriptions = await Subscription.find({ subscriber : subscriberId }).populate('channel', 'name email');

    if(!subscriptions) {
        throw new ApiError(404, 'No Subscriptions Found');
    }

    return res
    .status(200)
    .json(new ApiResponse(200, 'Subscribed Channels Fetched Successfully', subscriptions));
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}