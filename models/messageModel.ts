const { MessageSchemaModel } = require("../Interfaces/Interfaces");
import mongoose, { Error as MongooseError } from "mongoose";
import { MessageInterface } from "../Interfaces/Interfaces";
const userModel = require("./userModel");
const moment = require('moment-timezone');
interface MessageModel {
    message: MessageInterface;
    channel_name: string;
}


exports.createMessage = async ({ message }: MessageModel) => {
    try {
        let response = await MessageSchemaModel.create(message);
        
        return { status: 201, success: true, data: response };
    } catch (err) {
        console.log("createMessage", err);
        return { status: 401, success: false, message: err };
    }
};
exports.getMessages = async ({ channel_name }: MessageModel) => {
    try {
        // let response = await MessageSchemaModel.create(channel_name);
        const messages = await MessageSchemaModel.aggregate([
            {
                $match: { channel: channel_name },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "sender",
                    foreignField: "_id",
                    as: "senderInfo",
                },
            },
            {
                $unwind: "$senderInfo",
            },
            {
                $unwind: "$receivers",
            },
            {
                $lookup: {
                    from: "users",
                    localField: "receivers._id",
                    foreignField: "_id",
                    as: "receiverInfo",
                },
            },
            {
                $unwind: "$receiverInfo",
            },
            {
                $group: {
                    _id: "$_id",
                    channel: { $first: "$channel" },
                    message: { $first: "$message" },
                    msg_type: { $first: "$msg_type" },
                    is_message_deleted: { $first: "$is_message_deleted" },
                    sender: { $first: "$sender" },
                    senderInfo: { $first: "$senderInfo" },
                    medias: { $first: "$medias" },
                    createdAt: { $first: "$createdAt" },
                    updatedAt: { $first: "$updatedAt" },
                    receivers: {
                        $push: {
                            user_id: "$receivers._id",
                            read_at: "$receivers.read_at",
                            delivered_at: "$receivers.delivered_at",
                            reaction: "$receivers.reaction",
                            _id: "$receiverInfo._id",
                            name: "$receiverInfo.name",
                            email: "$receiverInfo.email",
                            img: "$receiverInfo.img",
                        },
                    },
                },
            },
        ]);

        console.log(messages);
        
        return { status: 201, success: true, data: messages };
    } catch (err) {
        console.log("getMessages", err);
        return { status: 401, success: false, message: err };
    }
};
