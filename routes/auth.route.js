import express from "express";
import { loginUser, signupUser } from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/signup", signupUser);
router.get("/profile", authenticate, authorize(["USER","ADMIN"]), (req, res) => {
    res.json({ user: req.user });
});

export default router;