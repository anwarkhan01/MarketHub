import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";
import { serviceProvider } from "../models/service_provider.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
        // console.log(token);

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        console.log(decodedToken.role === "serviceProvider");
        if (decodedToken?.role === "serviceProvider") {
            // console.log(sp)
            const sp = await serviceProvider.findById(decodedToken?._id).select("-password -refreshToken")
            if (!sp) {
                throw new ApiError(401, "Invalid Access Token from sp")
            }
            req.sp = sp;
            return next()
        }
        else {
            const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
            if (!user) {
                throw new ApiError(401, "Invalid Access Token from user")
            }
            req.user = user;
            return next()
        }

        // const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        // if (!user) {
        //     throw new ApiError(401, "Invalid Access Token")
        // }

        // req.user = user;
        // next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }

})