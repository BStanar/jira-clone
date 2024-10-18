import { z } from "zod";

export const loginSchema = z.object(
    {
        email: z.string().email(),
        password: z.string().min(1,"Reqired"),
    }
);

export const registerSchema = z.object(
    {
        email: z.string().email(),
        password: z.string().min(8,"Minimum 8 characters reqired"),
        name: z.string().trim().min(1, "Reqired"),
    }
);