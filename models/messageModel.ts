const { MessageSchemaModel, ChannelListSchemaModel } = require("../Interfaces/Interfaces");
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

        // this is for announcement msg type and channel
        if (message.channel_type==="announcement"){
            
            await Promise.all(message?.receivers?.map(async (receiver)=>{
                const update = {
                    $set: {
                        last_msg:message.message,
                        received: true,
                        timestamp: new Date(),
                        updatedAt: new Date(),
                        msg_id:response._id
                    }
                };
                const options = {
                    new: true, 
                };
                let channel = await ChannelListSchemaModel.findOneAndUpdate({
                    $or: [
                        { channel: `chat_${message?.sender?.email}_${receiver.email}` },
                        { channel: `chat_${receiver.email}_${message?.sender?.email}` }
                    ]
                }, 
                update, // Update operations
                options // Options
                );
                let subMessage = {
                    channel: channel?.channel,
                    channel_type: message?.channel_type,
                    medias: message?.medias,
                    message: message?.message,
                    msg_type: message?.msg_type,
                    is_message_deleted: message?.is_message_deleted,
                    sender: message.sender,
                    receivers: [ { _id: receiver?._id, email:receiver.email, read_at: receiver?.read_at, reaction: receiver?.reaction } ]
                };
                let subResponse = await MessageSchemaModel.create(subMessage);
            }))
            
        }

         // this is end of announcement msg type and channel

        const update = {
            $set: {
                last_msg:message.message,
                received: true,
                timestamp: new Date(),
                updatedAt: new Date(),
                msg_id:response._id
            }
        };
        const options = {
            new: true, 
        };

        // Execute the findOneAndUpdate operation
        let channel = await ChannelListSchemaModel.findOneAndUpdate(
            { channel: message?.channel }, // Filter criteria to find the document to update
            update, // Update operations
            options // Options
        );

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
                    localField: "sender._id",
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
            {
                $sort: { createdAt: 1 } // Sort by createdAt in ASC order
            },
        ]);

        return { status: 201, success: true, data: messages };
    } catch (err) {
        console.log("getMessages", err);
        return { status: 401, success: false, message: err };
    }
};
