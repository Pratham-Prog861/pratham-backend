import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    // create playlist
    const newPlaylist = new Playlist({
        name, 
        description,
        owner : req.user._id,
        videos : [],
        isPublic : false,
        visibility : "private",
    })

    if(!newPlaylist) {
        throw new ApiError(400, 'Failed to create Playlist');
    }

    if(!isValidObjectId(req.user._id)) {
        throw new ApiError(400, 'Invalid User ID');
    }

    await newPlaylist.save();

    return res
    .status(201)
    .json(new ApiResponse(201, 'Playlist created Successfully', newPlaylist));
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists

    if(!isValidObjectId(userId)) {
        throw new ApiError(400, 'Invalid User ID');
    }    

    const playlists = await Playlist.find({owner : userId}).populate('owner', 'name email');

    if(!playlists) {
        throw new ApiError(404, 'No Playlists Found');
    }

    return res
    .status(200)
    .json(new ApiResponse(200, 'Playlists Fetched Successfully', playlists));
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id

    if(!isValidObjectId(playlistId)) {
        throw new ApiError(400, 'Invalid Playlist ID');
    }

    const playlist = await Playlist.findById(playlistId).populate('owner', 'name email');

    if(!playlist) {
        throw new ApiError(404, 'Playlist not found');
    }

    return res
    .status(200)
    .json(new ApiResponse(200, 'Playlist Fetched Successfully', playlist));
})


const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    if(!isValidObjectId(playlistId)) {
        throw new ApiError(400, 'Invalid Playlist ID');
    }

    if(!isValidObjectId(videoId)) {
        throw new ApiError(400, 'Invalid Video ID');
    }

    const existingVideo = await Playlist.findOne({_id : playlistId, videos : videoId});

    if(existingVideo) {
        throw new ApiError(400, 'Video already exists in playlist');
    }

    const playlist = await Playlist.findById(playlistId);

    if(!playlist) {
        throw new ApiError(404, 'Playlist not found');
    }

    playlist.videos.push(videoId);

    await playlist.save();

    return res
    .status(200)
    .json(new ApiResponse(200, 'Video added to playlist Successfully', playlist));
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist

    if(!isValidObjectId(playlistId)) {
        throw new ApiError(400, 'Invalid Playlist ID');
    }

    if(!isValidObjectId(videoId)) {
        throw new ApiError(400, 'Invalid Video ID');
    }

    const playlist = await Playlist.findById(playlistId);

    if(!playlist) {
        throw new ApiError(404, 'Playlist not found');
    }

    const videoExists = playlist.videos.some(id => id.toString() === videoId.toString())

    if(!videoExists) {
        throw new ApiError(400, 'Video not found in playlist');
    }

    playlist.videos = playlist.videos.filter(id => id.toString() !== videoId.toString());

    if(!playlist.videos.includes(videoId)) {
        throw new ApiError(400, 'Video not found in playlist');
    }

    if(playlist.videos.length === 0) {
        throw new ApiError(400, 'Playlist is empty');
    }

    await playlist.save();

    return res
    .status(200)
    .json(new ApiResponse(200, 'Video removed from playlist Successfully', playlist));
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist

    if(!isValidObjectId(playlistId)) {
        throw new ApiError(400, 'Invalid Playlist ID');
    }

    const playlist = await Playlist.findById(playlistId);

    if(!playlist) {
        throw new ApiError(404, 'Playlist not found');
    }

    await playlist.remove();

    return res
    .status(200)
    .json(new ApiResponse(200, 'Playlist Deleted Successfully'));
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist

    if(!isValidObjectId(playlistId)) {
        throw new ApiError(400, 'Invalid Playlist ID');
    }

    const playlist = await Playlist.findById(playlistId);

    if(!playlist) {
        throw new ApiError(404, 'Playlist not found');
    }

    playlist.name = name;
    playlist.description = description;

    await playlist.save();

    return res
    .status(200)
    .json(new ApiResponse(200, 'Playlist Updated Successfully', playlist));
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}