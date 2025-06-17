import { Router } from "express";
import { registerUser, loginUser, updateUserData } from "../controllers/user.controller.js";
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
router.route("/update-user-data").put(
    upload.fields([
        {
            name: "profilePhoto",
            maxCount: 1
        },
    ]), updateUserData)
// router.route("/update-user-data").put((req, res) => {
//     console.log(req.body)
//     res.json({ "message": "success" })
// })




export default router