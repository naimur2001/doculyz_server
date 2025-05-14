import z  from "zod";

//user zod schema

export const createUserSchema = z.object({
 fullName: z.string().min(3).max(50),
        email: z.string().email(),
        password: z.string().min(6)
})  

export const userIdSchema = z.object({
    params: z.object({
        userId: z.string().uuid({message: "Invalid User Id"}),
    })
})


export const loginUserSchema = z.object({
     email: z.string().email(),
        password: z.string().min(6)
})