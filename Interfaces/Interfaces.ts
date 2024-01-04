
import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    status: { type: String, required: true },
    country: { type: String, required: true },
    password: { type: String, required: true },
    img: String
});
const userListSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    img: String
});


const whatsAppUserListSchema = new mongoose.Schema({
    name: { type: String, required: true },
    status: { type: String, required: true, unique: true },
    img: String
});

export type RegisterUser = mongoose.InferSchemaType<typeof userSchema>;
export type User = mongoose.InferSchemaType<typeof userListSchema>;
export type WhatsappUser = mongoose.InferSchemaType<typeof whatsAppUserListSchema>;

module.exports = {
    RegisterUserSchemaModel: mongoose.model<RegisterUser>('User', userSchema),
    UserSchemaModel: mongoose.model<User>('Users', userListSchema),
    WhatsAppUserSchemaModel: mongoose.model<WhatsappUser>('Users', userListSchema)
};
