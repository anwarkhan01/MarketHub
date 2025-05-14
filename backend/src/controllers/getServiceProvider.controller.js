import { serviceProvider } from "../models/service_provider.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getCachedProfessions } from "../utils/professionCache.js";

function extractProfession(input) {
    const lower = input.toLowerCase();
    const professions = getCachedProfessions();

    if (professions.includes(lower)) {
        return lower;
    }
    return professions.find(prof =>
        lower.includes(prof) || lower.includes(prof + "s")
    );
}

const getServiceProvider = asyncHandler(async (req, res) => {
    let { profession } = req.query

    const extractedProfession = extractProfession(profession)

    profession = extractedProfession
    const serviceProviderData = await serviceProvider.find({ profession }).select("-password")

    if (serviceProviderData.length === 0) {
        throw new ApiError(430, "service provider not found")
    }
    res.status(200).send(new ApiResponse(200, { serviceProviderData }, "Data fetched successfully!"))
})

const getGeneralServiceProviders = asyncHandler(async (req, res) => {
    const serviceProviderData = await serviceProvider.find().select("-password")
    if (serviceProviderData.length === 0) {
        throw new ApiError(430, "service providers not found")
    }
    res.status(200).send(new ApiResponse(200, { serviceProviderData }, "Data fetched successfully!"))
})
export { getServiceProvider, getGeneralServiceProviders }