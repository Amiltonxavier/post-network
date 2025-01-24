import { z } from "zod";

const envSchema = z.object({
    VITE_APP_URL: z.string().url(),
    //VITE_ENABLE_API_DEPAY: z.string().transform((value) => value === 'true')
})


export const env = envSchema.parse(import.meta.env)