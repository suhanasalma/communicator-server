
import mongoose, { Document, Schema }  from 'mongoose';
const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    status: { type: String, required: true },
    country: { type: String, required: true },
    password: { type: String, required: true },
    img: String
});
const userListSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    img: String
});


const whatsAppUserListSchema = new Schema({
    name: { type: String, required: true },
    status: { type: String, required: true, unique: true },
    img: String
});
const channelListSchema = new Schema({
    channel: { type: String, required: true ,unique: true},
    last_msg: String,
    timestamp: Number,
    counter: Object
});

export type RegisterUserInterface = mongoose.InferSchemaType<typeof userSchema>;
export type UserInterface = mongoose.InferSchemaType<typeof userListSchema>;
export type WhatsappUserInterface = mongoose.InferSchemaType<typeof whatsAppUserListSchema>;
export type ChannelListInterface = mongoose.InferSchemaType<typeof channelListSchema>;

module.exports = {
    RegisterUserSchemaModel: mongoose.model<RegisterUserInterface>('User', userSchema),
    UserSchemaModel: mongoose.model<UserInterface>('Users', userListSchema),
    WhatsAppUserSchemaModel: mongoose.model<WhatsappUserInterface>('Users', userListSchema),
    ChannelListSchemaModel: mongoose.model<ChannelListInterface>('channel', channelListSchema)
};
