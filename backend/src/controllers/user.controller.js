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
    const { username, name, email, password, location } = req.body

    if (
        [username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "Ensure required fields are filled")
    }

    const existedUser = await User.findOne({ username })

    if (existedUser) {
        throw new ApiError(409, "User with this username is already exists")
    }


    let profilePhotoPath;
    let profilePhotoUplaodResponse;
    if (req.files && Array.isArray(req.files.profilePhoto) && req.files.profilePhoto.length > 0) {
        profilePhotoPath = req.files.profilePhoto[0]?.path;
        profilePhotoUplaodResponse = await uploadOnCloudinary(profilePhotoPath)

    }

    const user = await User.create({
        username: username.toLowerCase(),
        name,
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
        new ApiResponse(200, { user: createdUser }, "User registered Successfully")
    )

})


const loginUser = asyncHandler(async (req, res) => {

    const { username, password } = req.body

    if (!username) throw new ApiError(400, "username is required")
    if (!password) throw new ApiError(400, "password is required")

    const user = await User.findOne({ username })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Password is wrong")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: false,
        secure: true,
        sameSite: "None",
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200, { user: loggedInUser, accessToken, refreshToken },
                "User logged In Successfully"
            )
        )
})

const updateUserData = asyncHandler(async (req, res) => {
    const { username, ...updatedFields } = req.body

    let profilePhotoPath;
    let profilePhotoUplaodResponse;
    if (req.files && Array.isArray(req.files.profilePhoto) && req.files.profilePhoto.length > 0) {
        profilePhotoPath = req.files.profilePhoto[0]?.path;
        profilePhotoUplaodResponse = await uploadOnCloudinary(profilePhotoPath)
    }


    const updatedUserData = await User.findOneAndUpdate(
        { username: username.toLowerCase() },
        {
            $set: {
                ...updatedFields,
                profilePhoto: profilePhotoUplaodResponse?.url,
            },
        },
        { new: true }
    );


    res.status(200).json(new ApiResponse(200, { user: updatedUserData }, "Data Updated Successfully"));
})
const verifyUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(
            new ApiResponse(
                200, { user: req.user },
                "Logged in user"
            )
        )
})

export { registerUser, loginUser, verifyUser, updateUserData }