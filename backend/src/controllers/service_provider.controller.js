
import { serviceProvider } from "../models/service_provider.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";



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
    console.log(req.body)
    const { fullname,
        email,
        username,
        password,
        // professionDescription,
        about,
        profession,
        // profilePhoto,
        experience,
        phoneNumber,
        location
    } = req.body

    if (
        [fullname, email, username, password, profession, phoneNumber, location, about]
            .some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }


    const existedUser = await serviceProvider.findOne({ username })

    if (existedUser) {
        throw new ApiError(409, "User with username already exists")
    }


    const profilePhotoPath = req.files?.profilePhoto[0]?.path;
    console.log(profilePhotoPath)

    let profilePhotoUplaodResponse;
    if (profilePhotoPath) {
        profilePhotoUplaodResponse = await uploadOnCloudinary(profilePhotoPath)
    }
    if (!profilePhotoPath) {
        throw new ApiError(400, "path not found")
    }

    const sp = await serviceProvider.create({
        fullname,
        email,
        username: username.toLowerCase(),
        password,
        // professionDescription,
        profilePhoto: profilePhotoUplaodResponse?.url || "",
        about: about || " ",
        profession,
        experience: experience || " ",
        phoneNumber,
        location: location || " ",
        role: "serviceProvider",

    })

    console.log(sp)
    const createdSP = await serviceProvider.findById(sp._id).select(
        "-password"
    )
    console.log(createdSP)
    if (!createdSP) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdSP, "User registered Successfully")
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
    console.log(username);

    if (!username) {
        throw new ApiError(400, "username is required")
    }

    const sp = await serviceProvider.findOne({ username })

    if (!sp) {
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid = await sp.isPasswordCorrect(password)
    console.log(isPasswordValid)
    // const sayhello = await sp.helllo()

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")
    }
    // console.log(sp._id)

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(sp._id)

    console.log("access and refresh tokens generated", { accessToken, refreshToken })
    const loggedInUser = await serviceProvider.findById(sp._id).select("-password")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .cookie("isLoggedIn", true)
        .json(
            new ApiResponse(
                200, { sp: loggedInUser },
                "User logged In Successfully"
            )
        )

})

export { registerServiceProvider, loginServiceProvider, verifySP }