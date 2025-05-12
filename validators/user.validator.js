import z  from "zod";

//user zod schema

export const createUserSchema = z.object({
    body: z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6)
    })
})  

export const userIdSchema = z.object({
    params: z.object({
        userId: z.string().uuid({message: "Invalid User Id"}),
    })
})