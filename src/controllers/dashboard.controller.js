import mongoose from "mongoose"
import { Video } from "../models/video.model.js"
import { Subscription } from "../models/subscription.model.js"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const channelId = req.params.channelId

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(400, 'Invalid Channel Id');
    }

    const totalVideos = await Video.countDocuments({ channel: channelId, isDeleted: false })
    const totalSubscribers = await Subscription.countDocuments({ channel: channelId })
    const totalViewsAggregate = await Video.aggregate([
        { $match: { channel: mongoose.Types.ObjectId(channelId), isDeleted: false } },
        { $group: { _id: null, totalViews: { $sum: "$views" } } }
    ])
    const totalViews = totalViewsAggregate[0] ? totalViewsAggregate[0].totalViews : 0
    const totalLikesAggregate = await Like.aggregate([
        { $match: { channel: mongoose.Types.ObjectId(channelId), isDeleted: false } },
        { $group: { _id: null, totalLikes: { $sum: 1 } } }
    ])
    const totalLikes = totalLikesAggregate[0] ? totalLikesAggregate[0].totalLikes : 0

    return res
        .status(200)
        .json(new ApiResponse(200, 'Channel Stats Fetched Successfully', {
            totalVideos,
            totalSubscribers,
            totalViews,
            totalLikes,
        }))
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // Get all the videos uploaded by the channel
    const channelId = req.params.channelId;

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(400, 'Invalid Channel ID');
    }

    const videos = await Video.find({ channel: channelId, isDeleted: false })

    return res
        .status(200)
        .json(new ApiResponse(200, 'Channel Videos Fetched Successfully', videos));
})

export {
    getChannelStats,
    getChannelVideos
}