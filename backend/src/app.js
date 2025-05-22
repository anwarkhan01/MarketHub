import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import { ApiError } from "./utils/ApiError.js"
import { verifyJWT } from "./middlewares/auth.middleware.js"
import { verifyUser } from "./controllers/user.controller.js"
import { verifySP } from "./controllers/service_provider.controller.js"

dotenv.config({
    path: "./.env"
})

dotenv.config({
    path: "./.env.local", override: true
})

const app = express()
console.log("FRONTEND_URL", process.env.FRONTEND_URL)
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())

import userRouter from "./routes/user.route.js"
import serviceProviderRouter from "./routes/serviceProvider.route.js"
app.use("/api/v1/user", userRouter)

app.use("/api/v1/service-provider", serviceProviderRouter)
app.get("/api/v1/verify", verifyJWT, (req, res) => {
    console.log("received request")
    if (req.sp) {
        return verifySP(req, res);
    }
    else {
        return verifyUser(req, res);
    }
}
)
app.use((err, req, res, next) => {
    if (err instanceof ApiError) {
        res.status(err.statusCode).json({
            status: "error",
            message: err.message,
        });
    } else {
        res.status(500).json({
            status: "error",
            message: err.message
        });
    }
});

export { app }