import express from "express";
import { loginUser, signupUser, logoutUser, googleLogin } from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/login", loginUser);

router.post("/signup", signupUser);

router.post("/logout", logoutUser);

router.post("/google", googleLogin);

router.get("/profile", authenticate, authorize(["USER","ADMIN"]), (req, res) => {
//  console.log("Authenticated user:", req.user); // Logging req.user
   
    // res.json({ user: req.user });
    const { fullName, email, imageUrl, role } = req.user; // from JWT
  res.json({
    user: { fullName, email, imageUrl, role }
  });
});

export default router;