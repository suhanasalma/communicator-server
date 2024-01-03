
import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    img: String
});
const userListSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    img: String
});

export type RegisterUser = mongoose.InferSchemaType<typeof userSchema>;
export type User = mongoose.InferSchemaType<typeof userListSchema>;

module.exports = {
    RegisterUserModel: mongoose.model<RegisterUser>('User', userSchema),
    UserModel: mongoose.model<User>('Users', userListSchema)
};
