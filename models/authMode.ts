const { RegisterUserSchemaModel } = require("../Interfaces/Interfaces")
import { RegisterUserInterface } from '../Interfaces/Interfaces';
import { Error as MongooseError } from 'mongoose';
const util = require('../util/password');

interface UserModel {
    user: RegisterUserInterface;
    email: string;
    password: string;
    country: string;
}
exports.register = async ({ user }: UserModel) => {
    try {
        const addingUser = new RegisterUserSchemaModel(user)
        let saveuser: RegisterUserInterface = await addingUser.save()
        return {
            status: 201, success: true, data: {
                "user": saveuser,
            }
        }
    } catch (err) {
        if (err instanceof MongooseError) {
            return { status: 500, success: false, error: (err as MongooseError).message }
        } else {
            console.log("Unknown error: ", (err as Error).message);
            return { status: 500, success: false, error: (err as Error).message }
        }

    }
};


exports.login = async ({ email, password }: UserModel) => {
    try {
        let user = await RegisterUserSchemaModel.findOne({ 'email': email });
        if (user) {
            let match = await util.passwordDecription(password, user.password)
            if (match) {
                return { status: 201, success: true, data: {
                    "user": user,
                }}
            }
            return { status: 500, success: false, error: "password did not matched, kindly provide correct password" }
        }

        return { status: 404, success: false, error: "user not found" }

    } catch (err) {
        console.log("error", err);
    }
};