import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination

    const filter = {}

    // If userId is provided, validate it and filter by owner
    if (userId) {
        if (!isValidObjectId(userId)) {
            throw new ApiError(400, "Invalid User ID")
        }
        filter.owner = userId
    }

    // If query is provided, match against video title or description
    if (query) {
        filter.$or = [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } }
        ]
    }

    // Sorting (default: newest first)
    const sortOrder = sortType === "asc" ? 1 : -1
    const sortOptions = { [sortBy]: sortOrder }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit)

    const videos = await Video.find(filter)
        .populate("owner", "name email")
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit))

    const totalVideos = await Video.countDocuments(filter)

    if (videos.length === 0) {
        throw new ApiError(404, "No videos found")
    }

    return res.status(200).json(
        new ApiResponse(200, "Videos fetched successfully", {
            total: totalVideos,
            page: Number(page),
            limit: Number(limit),
            videos,
        })
    )
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video

    // Validation
    if (!title || !description) {
        throw new ApiError(400, "Title and description are required")
    }

    if (!req.file) {
        throw new ApiError(400, "Video thumbnail file is required")
    }

    // Upload thumbnail to Cloudinary
    let thumbnailUrl
    try {
        thumbnailUrl = await uploadOnCloudinary(req.file.path)
    } catch (error) {
        throw new ApiError(500, "Failed to upload thumbnail")
    }

    // Create video document
    const video = await Video.create({
        title,
        description,
        owner: req.user._id,
        thumbnail: thumbnailUrl,
        isPublic: true,
        visibility: "public",
    })

    return res
    .status(201)
    .json( new ApiResponse(201, "Video created successfully"))
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id

    // Validate videoId
    if (!videoId || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    // Fetch video (and optionally increment view count)
    const video = await Video.findById(videoId)
        .populate("owner", "name email")
        .select("title description thumbnail views visibility createdAt owner") // selective fields

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    // Optional: increment view count
    await Video.findByIdAndUpdate(videoId, { $inc: { views: 1 } })

    // Return clean response
    return res
    .status(200)
    .json( new ApiResponse(200, "Video fetched successfully"))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

    // Validate videoId
    if (!videoId || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    // Fetch video
    const video = await Video.findById(videoId)
        .populate("owner", "name email")
        .select("title description thumbnail views visibility createdAt owner") // selective fields

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    // Update video
    video.title = req.body.title || video.title
    video.description = req.body.description || video.description
    video.thumbnail = req.body.thumbnail || video.thumbnail

    await video.save()

    return res
    .status(200)
    .json( new ApiResponse(200, "Video updated successfully"))

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video

    // Validate videoId
    if (!videoId || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    // Fetch video
    const video = await Video.findById(videoId)
        .populate("owner", "name email")
        .select("title description thumbnail views visibility createdAt owner") // selective fields

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    // Delete video
    await video.remove()

    return res
    .status(200)    
    .json( new ApiResponse(200, "Video deleted successfully"))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    // Validate videoId
    if (!videoId || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    // Fetch video
    const video = await Video.findById(videoId)
        .populate("owner", "name email")
        .select("title description thumbnail views visibility createdAt owner") // selective fields

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    // Toggle publish status
    video.isPublic = !video.isPublic

    await video.save()

    return res
    .status(200)    
    .json( new ApiResponse(200, "Video publish status toggled successfully"))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}