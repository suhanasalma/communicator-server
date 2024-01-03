import bcrypt from "bcrypt";
const saltRounds = 10;

exports.passwordEncription = async (password:string) =>{
    try {
        const hash = bcrypt.hashSync(password, saltRounds);
        return hash
    } catch (error) {
        console.log("passwordEncription error",error);
    }
}


exports.passwordDecription = async (password:string,hashedPassword:string) =>{
    try {
        const match = await bcrypt.compare(password, hashedPassword);
        return match
    } catch (error) {
        console.log(" passwordDecription error",error);
    }
}