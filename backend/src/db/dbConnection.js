import mongoose from "mongoose"
import { DB_NAME } from "../constant.js"

const connectDB = async () => {
    try {
        const response = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(response.connection.host)
    } catch (error) {
        console.log("Error occured while connecting to DataBase", error)
    }
}


export { connectDB }