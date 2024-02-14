const { ChannelListSchemaModel } = require("../Interfaces/Interfaces");
import mongoose, { Error as MongooseError } from "mongoose";
const userModel = require("./userModel");
const moment = require('moment-timezone');
interface ChatChannelModel {
    email: string | null | undefined;
    password: string;
    country: string;
    chat_index_status: string;
    user_id: string;
    channel_id: string;
    channelInfo: any;
    group_type: string;
    check_member: string;
}


exports.getChatChannelsByEmailAndIndexType = async ({
    email,
    chat_index_status,
}: ChatChannelModel) => {
    try {
        let user = await userModel.getUserByEmail({ email });
        let query: Record<string, any> = {}
        if (chat_index_status) {
            query.chat_index_status = chat_index_status
        }
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
                    channel: { $first: "$channel" },
                    last_msg: { $first: "$last_msg" },
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
                    participants: {
                        $push: {
                            user_id: "$participants.user_id",
                            counter: "$participants.counter",
                            admin: "$participants.counter",
                            _id: "$user._id",
                            name: "$user.name",
                            email: "$user.email",
                            img: "$user.img",
                            joined_at: "$participants.joined_at",
                        },
                    },
                },
            },
        ]);

        return channelsWithUsers;
        // return {totalCHannel:channelsWithUsers.length,channels:channelsWithUsers};
    } catch (err) {
        console.error("Error:", err);
        throw err; // Rethrow the error for higher-level handling
    }
};
exports.getAllTypeChatChannels = async ({
    email,
    chat_index_status,
    group_type,
    channel_id
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
                    channel: { $first: "$channel" },
                    last_msg: { $first: "$last_msg" },
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
                    participants: {
                        $push: {
                            user_id: "$participants.user_id",
                            counter: "$participants.counter",
                            admin: "$participants.counter",
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
        ]);

        return { totalCHannel: channelsWithUsers.length, channels: channelsWithUsers };
    } catch (err) {
        console.error("Error:", err);
        throw err; // Rethrow the error for higher-level handling
    }
};

exports.createChatChannel = async ({ channelInfo }: ChatChannelModel) => {
    try {
        // const bdTimestamp = moment().tz('Asia/Dhaka').toDate();
        // channelInfo.timestamp = bdTimestamp;
        // channelInfo.created_at = bdTimestamp;
        // channelInfo.updated_at = bdTimestamp;
        channelInfo.timestamp = new Date;
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
