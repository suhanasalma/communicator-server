const {ChannelListSchemaModel } = require("../Interfaces/Interfaces")
import { Error as MongooseError } from 'mongoose';

interface ChatChannelModel {
    email: string | null | undefined;
    password: string;
    country: string
}



exports.getChatChannel = async ({email }: ChatChannelModel) => {
    try {
        let channels = await ChannelListSchemaModel.find({ channel: { $regex: email, $options: 'i' } });
        return channels;
    } catch (err) {
        console.log("err", err);;
    }
};