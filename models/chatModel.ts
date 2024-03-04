const { ChannelListSchemaModel } = require("../Interfaces/Interfaces");
import mongoose, { Error as MongooseError } from "mongoose";
const userModel = require("./userModel");
const moment = require('moment-timezone');
interface ChatChannelModel {
    email: string | null | undefined;
    name: string | null | undefined;
    searchTextName: string | null | undefined;
    password: string;
    country: string;
    chat_index_status: string;
    user_id: string;
    channel_id: string;
    channel_name: string;
    channelInfo: any;
    group_type: string;
    check_member: string;
    filter: string;
    participants: []
};


//get all channel with announcement and all but only for announcement admin
exports.getChatChannelsByEmailAndIndexType = async ({
    email,
    chat_index_status,
    searchTextName,
    filter
}: ChatChannelModel) => {
    try {
        let user = await userModel.getUserByEmail({ email });
        let query: Record<string, any> = {}
        if (chat_index_status) {
            query.chat_index_status = chat_index_status
        };
        if (searchTextName) {
            query.participant_name = { $elemMatch: { $regex: searchTextName, $options: 'i' } }
        };
        if (filter && filter !== "unread") {
            query.group_type = filter
        };
        if (filter && filter === "unread") {
            query.read = false
        };

        const channelsWithUsers = await ChannelListSchemaModel.aggregate([
            {
                $match: {
                    $and: [
                        {
                            $or: [
                                {
                                    "participants.user_id": { $in: [user._id] },
                                    group_type: { $in: ["one-to-one", "group",] },
                                    ...query,
                                },
                                // { admin: user._id, group_type: "announcement" , ...query,},
                                { "participants": { "$elemMatch": { "user_id": user._id, "admin": true } }, group_type: "announcement", ...query, },
                            ],
                        },
                    ],
                },
            },
            {
                $unwind: "$participants",
            },
            {
                $lookup: {
                    from: "users",
                    localField: "participants.user_id",
                    foreignField: "_id",
                    as: "user",
                },
            },
            {
                $unwind: "$user",
            },
            {
                $group: {
                    _id: "$_id",
                    background: { $first: "$background" },
                    gradient: { $first: "$gradient" },
                    personalized_background: { $first: "$personalized_background" },
                    personalized_gradient: { $first: "$personalized_gradient" },
                    channel: { $first: "$channel" },
                    last_msg: { $first: "$last_msg" },
                    msg_delete_status: { $first: "$msg_delete_status" },
                    msg_id: { $first: "$msg_id" },
                    timestamp: { $first: "$timestamp" },
                    chat_index_status: { $first: "$chat_index_status" },
                    msg_type: { $first: "$msg_type" },
                    read: { $first: "$read" },
                    received: { $first: "$received" },
                    img: { $first: "$img" },
                    name: { $first: "$name" },
                    admin: { $first: "$admin" },
                    createdAt: { $first: "$createdAt" },
                    updatedAt: { $first: "$updatedAt" },
                    group_type: { $first: "$group_type" },
                    group_permissions: { $first: "$group_permissions" },
                    participant_name: { $first: "$participant_name" },
                    participants: {
                        $push: {
                            user_id: "$participants.user_id",
                            counter: "$participants.counter",
                            admin: "$participants.admin",
                            _id: "$user._id",
                            name: "$user.name",
                            email: "$user.email",
                            img: "$user.img",
                            joined_at: "$participants.joined_at",
                        },
                    },
                },
            },
            {
                $sort: { timestamp: -1 } // Sort by createdAt in ASC order
            },
        ]);

        return channelsWithUsers;
        // return {totalCHannel:channelsWithUsers.length,channels:channelsWithUsers};
    } catch (err) {
        console.error("Error:", err);
        throw err; // Rethrow the error for higher-level handling
    }
};

//get all type channel even if they are not the creator
exports.getAllTypeChatChannels = async ({
    email,
    chat_index_status,
    group_type,
    channel_id,
    channel_name,
    searchTextName,
}: ChatChannelModel) => {
    try {
        let user = null;
        const matchConditions: Record<string, any> = {};

        if (channel_id) {
            if (mongoose.isValidObjectId(channel_id)) {
                matchConditions["_id"] = new mongoose.Types.ObjectId(channel_id);
            } else {
                return ("Invalid channel_id");
            }
        }
        if (channel_name) {
            matchConditions['channel'] = channel_name;
        }
        if (email) {
            user = await userModel.getUserByEmail({ email });
            matchConditions["participants.user_id"] = { $in: [user._id] };
        };

        if (group_type && group_type !== "announcement") {
            matchConditions.group_type = group_type;
        };
        if (group_type && group_type === "announcement") {
            matchConditions.group_type = group_type;
            matchConditions.admin = user._id;
        };
        if (chat_index_status) {
            matchConditions.chat_index_status = chat_index_status;
        };

        if (searchTextName) {
            matchConditions.participant_name = { $elemMatch: { $regex: searchTextName, $options: 'i' } };
        }


        const channelsWithUsers = await ChannelListSchemaModel.aggregate([
            {
                $match: matchConditions,

            },
            {
                $unwind: "$participants",
            },
            {
                $lookup: {
                    from: "users",
                    localField: "participants.user_id",
                    foreignField: "_id",
                    as: "user",
                },
            },
            {
                $unwind: "$user",
            },
            {
                $group: {
                    _id: "$_id",
                    background: { $first: "$background" },
                    gradient: { $first: "$gradient" },
                    personalized_background: { $first: "$personalized_background" },
                    personalized_gradient: { $first: "$personalized_gradient" },
                    channel: { $first: "$channel" },
                    last_msg: { $first: "$last_msg" },
                    msg_delete_status: { $first: "$msg_delete_status" },
                    msg_id: { $first: "$msg_id" },
                    timestamp: { $first: "$timestamp" },
                    createdAt: { $first: "$createdAt" },
                    updatedAt: { $first: "$updatedAt" },
                    chat_index_status: { $first: "$chat_index_status" },
                    msg_type: { $first: "$msg_type" },
                    group_type: { $first: "$group_type" },
                    read: { $first: "$read" },
                    received: { $first: "$received" },
                    img: { $first: "$img" },
                    name: { $first: "$name" },
                    admin: { $first: "$admin" },
                    group_permissions: { $first: "$group_permissions" },
                    participant_name: { $first: "$participant_name" },
                    participants: {
                        $push: {
                            user_id: "$participants.user_id",
                            counter: "$participants.counter",
                            admin: "$participants.admin",
                            status: "$user.status",
                            _id: "$user._id",
                            name: "$user.name",
                            email: "$user.email",
                            img: "$user.img",
                            joined_at: "$participants.joined_at",
                        },
                    },
                },
            },
            {
                $sort: { timestamp: -1 } // Sort by createdAt in ASC order
            },
        ]);

        return { totalCHannel: channelsWithUsers.length, channels: channelsWithUsers };
    } catch (err) {
        console.error("Error:", err);
        throw err; // Rethrow the error for higher-level handling
    }
};

exports.createChatChannel = async ({ channelInfo }: ChatChannelModel) => {
    try {
        let response = await ChannelListSchemaModel.create(channelInfo);
        if (response.group_type === 'group') {
            response.channel = `channel_group_${response._id}`
            await response.save();
        }
        if (response.group_type === 'announcement') {
            response.channel = `channel_announcement_${response._id}`
            await response.save();
        }
        return { status: 201, success: true, data: response };
    } catch (err) {
        console.log("createChatChannel", err);
        return { status: 401, success: false, message: err };
    }
};

exports.getCommonChannelAndGroups = async ({ email, participants }: ChatChannelModel) => {

    let response = await Promise.all(participants.map(async (participant) => {
        let channel = await ChannelListSchemaModel.findOne({
            $or: [
                { channel: `chat_${participant}_${email}` },
                { channel: `chat_${email}_${participant}` }
            ]
        });

        return channel

    }));

    return response;
}

