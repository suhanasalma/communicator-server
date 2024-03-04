const { UserSchemaModel } = require("../Interfaces/Interfaces");
import { RegisterUserInterface } from '../Interfaces/Interfaces';
const {ChannelListSchemaModel } = require("../Interfaces/Interfaces");
interface UserModel {
    user: RegisterUserInterface;
    email: string;
    password: string;
    country: string
    Comingemail:string
    name:string
}


exports.getUserByEmail = async({email}:UserModel)=>{
    try {
        let user = await UserSchemaModel.findOne({email:email}, { password: 0 })
        return user;
    } catch (error) {
        console.log(error);
    }
}

exports.getUsers = async () => {
    try {
        let users = await UserSchemaModel.find({}, { password: 0 })
        return users
    } catch (err) {
        console.log(err);
    }
};

exports.communicatorUsers = async ({ country, email, name }: UserModel) => {
    try {
        let query;

        const fieldsToInclude = ["name", "status", "img", "email"];

        const projection: { [key: string]: number } = fieldsToInclude.reduce((acc, field) => {
            const typedAcc = acc as { [key: string]: number };

            typedAcc[field] = 1;
            return typedAcc;
        }, {});

        const countryPattern = country && typeof country === 'string'? new RegExp(country, 'i') : /.*/ ;
        let channelList = await ChannelListSchemaModel.find({ channel: { $regex: email, $options: 'i' } });
        const channelEmails = channelList.map((channel:any) => channel.channel.split('_')).flat();

        if(name){
            query = {
                country: countryPattern,
                name:{ $regex: name, $options: 'i' },
                $and: [
                    { email: { $nin: email } },
                    { email: { $nin: channelEmails } }
                ],
            }
        }else{
            query = {
                country: countryPattern,
                $and: [
                    { email: { $nin: email } },
                    { email: { $nin: channelEmails } }
                ],
            }
        }
      
        let users = await UserSchemaModel.find(
            query,
            projection
        );
        return users;
    } catch (err) {
        console.log("err", err);;
    }
};
