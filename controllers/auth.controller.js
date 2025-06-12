import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import { signToken } from "../utils/jwt.js";
import { OAuth2Client } from "google-auth-library";
import { createUserSchema ,loginUserSchema} from "../validators/user.validator.js";



//google auth
const client=new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
export const googleLogin = async (req, res) => {
    const { idToken} = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const { email, name } = ticket.getPayload();
  let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          fullName: name,
          imageUrl: picture,
          password: "", // optional, since it's Google login
        },
      });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

  // Set cookie instead of sending token directly
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      token,
      user: {

        fullName: user.fullName,
        email: user.email, 
        imageUrl: user.imageUrl,
        role:user.role

      },
    });
  } catch (err) {
    console.error("Google login failed:", err);
    res.status(401).json({ message: "Invalid Google token" });
  }
};


//signup
export const signupUser = async (req, res) => {
  try {
      const validatedUser = createUserSchema.safeParse(req.body);
        if (!validatedUser.success) {
    // Zod error block
        return res.status(400).json({ 
      message: "Validation failed", 
      errors: validatedUser.error.errors, // <- Here Zod validation errors are returned
    });
     }

     const { fullName, email, password } = validatedUser.data;

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
      const token = signToken({ id: newUser.id,
          role: newUser.role,
          fullName: newUser.fullName,
            email: newUser.email
       });


res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      // sameSite: "Strict",
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

      res.status(201).json({
          message: 'User created',
          token, 
          user: {fullName: newUser.fullName,  
            email: newUser.email,
              imageUrl: newUser.imageUrl,
              role:newUser.role ,

   } });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
  }
};

// login

export const loginUser = async (req, res) => {
    try {
 const validatedUser = loginUserSchema.safeParse(req.body);
        if (!validatedUser.success) {
    // Zod error block
        return res.status(400).json({ 
      message: "Validation failed", 
      errors: validatedUser.error.errors, // <- Here Zod validation errors are returned
    });
     }


        const { email, password } = validatedUser.data;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = signToken({ id: user.id,
            role: user.role,
            fullName: user.fullName,
            email: user.email
         });

      res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      // sameSite: "Strict",
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      });

        res.json({
            message: "Login successful",
            token, 
            user: { fullName: user.fullName,
              email: user.email,
                imageUrl: user.imageUrl,
                role:user.role } }) 
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" }); 
        
    }

};



//logout
// ✅ Logout
export const logoutUser = (req, res) => {
  try {
    res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
    // sameSite: "Strict",
  });
  res.status(200).json({ message: "Logout successful" });
  } catch (error) {
   console.log(error.message); 
  }
};