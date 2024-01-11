const {ChannelListSchemaModel } = require("../Interfaces/Interfaces")
import mongoose, { Error as MongooseError } from 'mongoose';
const userModel = require('./userModel');

interface ChatChannelModel {
    email: string | null | undefined;
    password: string;
    country: string
    chat_index_status:string
    id:string
}



exports.getChatChannelListByEmailAndGroupType = async ({ email ,chat_index_status }: ChatChannelModel) => {
    try {

        let user = await userModel.getUserByEmail({email})
        const channelsWithUsers = await ChannelListSchemaModel.aggregate([
        {
        //   $match: { channel: { $regex: email, $options: 'i' }, chat_index_status:chat_index_status }
            $match: {
                "participants.user_id": { $in: [user._id] },
                group_type: { $in: ["one-to-one", "group"] },
                chat_index_status:chat_index_status
            }
        },
        {
          $unwind: "$participants"
        },
        {
          $lookup: {
            from: "users",
            localField: "participants.user_id",
            foreignField: "_id",
            as: "user"
          }
        },
        {
          $unwind: "$user"
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
                img:"$user.img"
              }
            }
          }
        }
      ]);
  
      return channelsWithUsers;
    } catch (err) {
      console.error("Error:", err);
      throw err; // Rethrow the error for higher-level handling
    }
};



exports.getChatIndexDetailsById = async ({id}:ChatChannelModel) => {
    try {
        let chatIndex = await ChannelListSchemaModel.findOne({_id:id},{ channel: 1, name: 1, img: 1, _id:1, group_type:1});
        return chatIndex;
    } catch (err) {
        console.log("err", err);
    }
};