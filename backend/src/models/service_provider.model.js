import mongoose, { Schema } from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { type } from "os"
const serviceProviderSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        unique: true,
        lowecase: true,
        trim: true,
    },
    name: {
        type: String,
        trim: true,
        index: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    phoneNumber: {
        type: Number,
        required: true,
        unique: true,
        trim: true,
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    profilePhoto: {
        type: String,   // Cloudinary

    },
    workImages: {
        type: String,  //Cloudinary
    },
    about: {
        type: String,
    },
    profession: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        required: true,
    },
    experience: String,
    rating: {
        type: Number,     //Dynamic
        min: 1,
        max: 5
    }
}, { timestamps: true })

serviceProviderSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

serviceProviderSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}




serviceProviderSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname,
            role: this.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: "1h"
        }
    )
}

serviceProviderSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            role: this.role

        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: "1d"
        }
    )
}
export const serviceProvider = mongoose.model("serviceProvider", serviceProviderSchema)