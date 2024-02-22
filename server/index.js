import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import userRouter from '../server/routes/user.route.js'
import authRouter from '../server/routes/auth.route.js'
import listingRouter from '../server/routes/listing.route.js'
import path from 'path'
dotenv.config();


const app = express()
const __dirname = path.resolve()

app.use(cors());
app.use(express.json());
app.use(cookieParser())

app.use("/api/user", userRouter)
app.use("/api/auth", authRouter)
app.use("/api/listing", listingRouter)

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log('Connected to the database!')
    }).catch((error) => {
        console.log(error.message)
    })

app.listen(5000, () => {
    console.log('Server is running on port 5000!')
})

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || "Internal Server Error"
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})
