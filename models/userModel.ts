const { UserSchemaModel } = require("../Interfaces/Interfaces")
import { RegisterUserInterface } from '../Interfaces/Interfaces';
import { Error as MongooseError } from 'mongoose';
const chatModel = require ('./chatModel')
interface UserModel {
    user: RegisterUserInterface;
    email: string;
    password: string;
    country: string
    Comingemail:string
}

exports.users = async () => {
    try {
        let users = await UserSchemaModel.find({}, { password: 0 })
        return users
    } catch (err) {
        console.log(err);
    }
};

exports.whatsAppUsers = async ({ country,email }: UserModel) => {
    try {
        const fieldsToInclude = ["name", "status", "img", "email"];

        const projection: { [key: string]: number } = fieldsToInclude.reduce((acc, field) => {
            const typedAcc = acc as { [key: string]: number };

            typedAcc[field] = 1;
            return typedAcc;
        }, {});

        const countryPattern = country && typeof country === 'string'? new RegExp(country, 'i') : /.*/ ;


        const channelList = await chatModel.getChatChannel({email:email});
        const channelEmails = channelList.map((channel:any) => channel.channel.split('_')).flat();
      
        let users = await UserSchemaModel.find(
            {
                country: countryPattern,
                $and: [
                    { email: { $nin: email } },
                    { email: { $nin: channelEmails } }
                ],
            },
            projection
        );
        return users;
    } catch (err) {
        console.log("err", err);;
    }
};
