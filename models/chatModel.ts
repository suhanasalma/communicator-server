const { ChannelListSchemaModel } = require("../Interfaces/Interfaces");
import mongoose, { Error as MongooseError } from "mongoose";
const userModel = require("./userModel");

interface ChatChannelModel {
    email: string | null | undefined;
    password: string;
    country: string;
    chat_index_status: string;
    id: string;
    channelInfo: any;
    group_type:string;
    check_member:string;
}


exports.getChatChannelListByEmailAndGroupType = async ({
    email,
    chat_index_status,
}: ChatChannelModel) => {
    try {
        let user = await userModel.getUserByEmail({ email });
        let query: Record<string, any> = {}
        if(chat_index_status){
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
                                { admin: user._id, group_type: "announcement" , ...query,},
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
                    created_at: { $first: "$created_at" },
                    group_type: { $first: "$group_type" },
                    participants: {
                        $push: {
                            user_id: "$participants.user_id",
                            counter: "$participants.counter",
                            _id: "$user._id",
                            name: "$user.name",
                            email: "$user.email",
                            img: "$user.img",
                        },
                    },
                },
            },
        ]);

        return channelsWithUsers;
    } catch (err) {
        console.error("Error:", err);
        throw err; // Rethrow the error for higher-level handling
    }
};
exports.getChatChannel = async ({
    email ,
    chat_index_status ,
    group_type 
}: ChatChannelModel) => {
    try {
        let user = null;
        const matchConditions: Record<string, any> = {};

        if(email){
            user = await userModel.getUserByEmail({ email });
            matchConditions["participants.user_id"] = { $in: [user._id] };
        };

        if ( group_type && group_type !== "announcement") {
            matchConditions.group_type = group_type;
        };
        if ( group_type && group_type === "announcement") {
            matchConditions.group_type = group_type;
            matchConditions.admin = user._id;
        };
        if ( chat_index_status ) {
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
                    channel: { $first: "$channel" },
                    created_at: { $first: "$created_at" },
                    chat_index_status: { $first: "$chat_index_status" },
                    group_type: { $first: "$group_type" },
                    participants: {
                        $push: {
                            user_id: "$participants.user_id",
                            status: "$user.status",
                            _id: "$user._id",
                            name: "$user.name",
                            email: "$user.email",
                            img: "$user.img",
                        },
                    },
                },
            },
        ]);

        return {totalCHannel:channelsWithUsers.length,channels:channelsWithUsers};
    } catch (err) {
        console.error("Error:", err);
        throw err; // Rethrow the error for higher-level handling
    }
};

exports.getChatIndexDetailsById = async ({ id }: ChatChannelModel) => {
    try {
        let chatIndex = await ChannelListSchemaModel.findOne(
            { _id: id },
            { channel: 1, name: 1, img: 1, _id: 1, group_type: 1 }
        );
        return chatIndex;
    } catch (err) {
        console.log("err", err);
    }
};

exports.createChatChannel = async ({ channelInfo }: ChatChannelModel) => {
    try {
        let response = await ChannelListSchemaModel.create(channelInfo);
        if(response.group_type === 'group'){
            response.channel = `channel_group_${response._id}`
            await response.save();
        }
        if(response.group_type === 'announcement'){
            response.channel = `channel_announcement_${response._id}`
            await response.save();
        }
        return {status:201, success:true, data:response};
    } catch (err) {
        console.log("createChatChannel",err);
        return {status:401, success:false, message: err};
    }
};
