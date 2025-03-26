import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"


const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = await user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(400, "some error occured while generating access and refresh token")
    }
}
const registerUser = asyncHandler(async (req, res) => {
    const { username, fullname, email, password, location } = req.body

    // if (
    //     [fullname, email, username, password].some((field) => field?.trim() === "")
    // ) {
    //     throw new ApiError(400, "All fields are required")
    // }

    console.log(username)
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }

    const profilePhotoPath = req.files?.profilePhoto[0]?.path;


    let profilePhotoUplaodResponse;
    if (profilePhotoPath) {
        profilePhotoUplaodResponse = await uploadOnCloudinary(profilePhotoPath)
    }

    const user = await User.create({
        username: username.toLowerCase(),
        fullname,
        profilePhoto: profilePhotoUplaodResponse?.url || "",
        email,
        password,
        location: location || " ",
        role: "user",
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

})



const loginUser = asyncHandler(async (req, res) => {

    const { email, username, password } = req.body
    console.log(username, email, password)
    if (!username) {
        throw new ApiError(400, "username is required")
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None",
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200, { user: loggedInUser },
                "User logged In Successfully"
            )
        )
})

const verifyUser = asyncHandler(async (req, res) => {
    console.log(req.user)
    return res
        .status(200)
        .json(
            new ApiResponse(
                200, { user: req.user },
                "Logged in user"
            )
        )
})

export { registerUser, loginUser, verifyUser }