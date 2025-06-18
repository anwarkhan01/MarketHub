
import { serviceProvider } from "../models/service_provider.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { loadProfessions } from "../utils/professionCache.js";

const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const sp = await serviceProvider.findById(userId)
        const accessToken = await sp.generateAccessToken()
        const refreshToken = sp.generateRefreshToken()
        sp.refreshToken = refreshToken
        await sp.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(400, error.message)
    }
}


const registerServiceProvider = asyncHandler(async (req, res) => {
    const { name,
        email,
        username,
        password,
        about,
        profession,
        experience,
        phoneNumber,
        location
    } = req.body

    if (
        [username, password, profession, phoneNumber, location]
            .some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "Ensure all required fields are filled")
    }


    const existedUser = await serviceProvider.findOne({ username })

    if (existedUser) {
        throw new ApiError(409, "User with this username is already exists")
    }

    let profilePhotoPath;
    let profilePhotoUplaodResponse;
    if (req.files && Array.isArray(req.files.profilePhoto) && req.files.profilePhoto.length > 0) {
        profilePhotoPath = req.files.profilePhoto[0]?.path;
        profilePhotoUplaodResponse = await uploadOnCloudinary(profilePhotoPath)
    }

    const sp = await serviceProvider.create({
        name,
        email,
        username: username.toLowerCase(),
        password,
        profilePhoto: profilePhotoUplaodResponse?.url || "",
        about: about || " ",
        profession,
        experience: experience || " ",
        phoneNumber,
        location: location || " ",
        role: "serviceProvider",

    })

    const createdSP = await serviceProvider.findById(sp._id).select(
        "-password"
    )
    if (createdSP) {
        loadProfessions()
    }
    console.log(createdSP)
    if (!createdSP) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, { sp: createdSP }, "User registered Successfully")
    )

})

const verifySP = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(
            new ApiResponse(
                200, { sp: req.sp },
                "Logged in Service Provider"
            )
        )
})

const loginServiceProvider = asyncHandler(async (req, res) => {

    const { username, password } = req.body

    if (!username) throw new ApiError(400, "username is required")
    if (!password) throw new ApiError(400, "password is required")


    const sp = await serviceProvider.findOne({ username })

    if (!sp) {
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid = await sp.isPasswordCorrect(password)

    if (!isPasswordValid) throw new ApiError(401, "Password is wrong")


    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(sp._id)

    const loggedInUser = await serviceProvider.findById(sp._id).select("-password -refreshToken")

    const options = {
        httpOnly: false,
        secure: true,
        sameSite: "None"
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .cookie("isLoggedIn", true)
        .json(
            new ApiResponse(
                200, { sp: loggedInUser },
                "Service Provider logged In Successfully"
            )
        )

})

const updateSPData = asyncHandler(async (req, res) => {
    const { username, ...updatedFields } = req.body
    console.log("sp", username, updatedFields)
    let profilePhotoPath;
    let profilePhotoUplaodResponse;
    if (req.files && Array.isArray(req.files.profilePhoto) && req.files.profilePhoto.length > 0) {
        profilePhotoPath = req.files.profilePhoto[0]?.path;
        profilePhotoUplaodResponse = await uploadOnCloudinary(profilePhotoPath)
    }

    const updatedSPData = await serviceProvider.findOneAndUpdate(
        { username: username.toLowerCase() },
        {
            $set: {
                ...updatedFields,
                profilePhoto: profilePhotoUplaodResponse?.url,
            },
        },
        { new: true }
    );

    res.status(200).json(new ApiResponse(200, { sp: updatedSPData }, "Data Updated Successfully"));
})

export { registerServiceProvider, loginServiceProvider, verifySP, updateSPData }