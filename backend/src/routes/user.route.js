import { Router } from "express";
import { registerUser, loginUser, verifyUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { getServiceProvider, getGeneralServiceProviders } from "../controllers/getServiceProvider.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router()


router.route("/registeruser").post(
    upload.fields([
        {
            name: "profilePhoto",
            maxCount: 1
        },
    ]), registerUser)

router.route("/search/service-provider").get(getServiceProvider)
router.route("/general-sp-data").get(getGeneralServiceProviders)
router.route("/user-login").post(loginUser)




export default router