
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

const participantSchema = new mongoose.Schema({
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    counter: {
      type: Number,
      default: 0,
    },
  });
  
const channelListSchema = new Schema({
    channel: { type: String, required: true ,unique: true},
    name: {
        type: String,
        default: '',
      },
      img: {
        type: String,
        default: '',
      },
      timestamp: {
        type: Number,
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
      created_at: {
        type: Date,
        default: null,
      },
      participants: [participantSchema],
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
