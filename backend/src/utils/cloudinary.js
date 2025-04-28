import { v2 as cloudinary } from "cloudinary"
import fs from "fs"


cloudinary.config({
    // cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    // api_key: process.env.CLOUDINARY_API_KEY,
    // api_secret: process.env.CLOUDINARY_API_SECRET
    cloud_name: 'dvhpj3kgm',
    api_key: '167881457654527',
    api_secret: '986uZ3oR_pd02yBeSQ07LsJUWrc'
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        console.log("cloudinary api key", process.env.CLOUDINARY_API_KEY)
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfull
        //console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        console.log("cloudinary error", error)
        return null;
    }
}



export { uploadOnCloudinary }
