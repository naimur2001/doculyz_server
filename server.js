import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import documentRouter from "./routes/document.route.js";
import cookieParser from "cookie-parser";

const app = express();

// ✅ Only allow frontend origin + allow credentials
app.use(
  cors({
    origin: "https://doculyz-client.vercel.app/", // your frontend URL
    credentials: true,
  })
);

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.get("/", (req, res) => {
    res.send("Hello World")
})

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/doc", documentRouter );

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000} `);
});