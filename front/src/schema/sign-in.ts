import { z } from "zod";

export const signInSchema = z.object({
  username: z.string().min(4),
  password: z
    .string()
    .nonempty({ message: "Senha inválida" })
    .min(8, { message: "Senha deve ter ao menos 8 caracteres" }),
});

export type signInType = z.infer<typeof signInSchema>;