import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.route.js";

const app = express();

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
    res.send("Hello World")
})

app.use("/api/v1/auth", authRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});