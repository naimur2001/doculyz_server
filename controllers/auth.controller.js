import prisma from "../lib/prisma"; 
import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
import { signToken } from "../utils/jwt";

//signup
export const signupUser = async (req, res) => {
    const { fullName, email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
        return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
        data: {
            fullName,
            email,
            password: hashedPassword,
        },
    });
    const token = signToken({ id: newUser.id });
    res.status(201).json({
        message: 'User created',
        token, 
        user: {name: user.fullName } });
};

// login

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = signToken({ id: user.id });
    res.json({
        message: "Login successful",
        token, 
        user: { name: user.fullName,role:user.role } });
};