
import { connectDB } from "./db/dbConnection.js"
import { app } from "./app.js"
import { loadProfessions } from "./utils/professionCache.js"

loadProfessions()

connectDB()
    .then(() => {
        app.listen(process.env.PORT, (req, res) => {
            console.log("FRONTEND_URL FROM INDEX.JS", process.env.FRONTEND_URL)
            console.log("Server is listening on port ", process.env.PORT)
        })
    })
    .catch((error) => {
        console.log("error occured while connecting to db", error)
    })