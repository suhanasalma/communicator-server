
import mongoose, { Document, Schema } from 'mongoose';
const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    status: { type: String, required: true },
    country: { type: String, required: true },
    password: { type: String, required: true },
    img: String
}, { timestamps: true });
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

const participantSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    counter: {
        type: Number,
        default: 0,
    },
    admin: {
        type: Boolean,
        default: false,
    },
    joined_at: {
        type: Date,
        default: Date,
    },
});
const groupPermissionsSchema = new mongoose.Schema({
    approve_new_member: {
        type: Boolean,
        default: false,
    },
    add_other_member: {
        type: Boolean,
        default: false,
    },
    send_message: {
        type: Boolean,
        default: true,
    },
    edit_group_setting: {
        type: Boolean,
        default: false,
    },
});

const channelListSchema = new Schema({
    channel: { type: String, required: true, unique: true },
    name: {
        type: String,
        default: '',
    },
    background: {
        type: String,
        default: '',
    },
    gradient: {
        type: Number,
        default: 0,
    },
    img: {
        type: String,
        default: '',
    },
    timestamp: {
        type: Date,
        default: Date,
        required: true,
    },
    last_msg: {
        type: String,
        default: '',
    },
    received: {
        type: Boolean,
        default: false,
    },
    read: {
        type: Boolean,
        default: false,
    },
    msg_delete_status: {
        type: Number,
        default: 0,
    },
    msg_id: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
    },
    chat_index_status: {
        type: String,
        required: true,
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
    },
    group_type: {
        type: String,
        required: true,
    },
    group_permissions: groupPermissionsSchema,
    participants: [participantSchema],
}, { timestamps: true });

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
