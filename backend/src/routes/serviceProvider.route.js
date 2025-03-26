import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { registerServiceProvider, loginServiceProvider } from "../controllers/service_provider.controller.js";
import { getGeneralServiceProviders } from "../controllers/getServiceProvider.controller.js";
const router = Router();

router.route("/register-sevice-provider").post(
    upload.fields([
        {
            name: "profilePhoto",
            maxCount: 1
        },
        {
            name: "workImages",
            maxCount: 5
        },
    ]),
    registerServiceProvider)

router.route("/data").get(getGeneralServiceProviders)
router.route("/login-sp").post(loginServiceProvider)
export default router