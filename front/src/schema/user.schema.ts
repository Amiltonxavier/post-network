import { z } from "zod";


export const UserSchema = z.object({
    username: z.string().min(3),
    password: z.string()
    .nonempty({ message: "Senha inválida" })
    .min(3, { message: "Senha deve ter ao menos 3 caracteres" }),
    fullName: z.string().min(8).nonempty({message: "Nome não pode estar vázio"}),
    imgUrl: z.string().url().optional(),
    cover: z.string().url().optional(),
    bio: z.string(),
    role: z.string().optional(),
});



export const profileSchema = z.object({
  fullName: z.string().min(2, "O nome completo deve ter pelo menos 2 caracteres.").optional(),
  username: z
    .string()
    .min(3, "O nome de usuário deve ter pelo menos 3 caracteres.")
    .regex(/^[a-zA-Z0-9_]+$/, "O nome de usuário só pode conter letras, números e _."),
  bio: z.string().max(160, "A bio pode ter no máximo 160 caracteres.").optional(),
  imgUrl: z.string().url("A URL da imagem deve ser válida.").optional(),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres.").optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export type userType = z.infer<typeof UserSchema> & {
  id: number
}

export type CreateUserType = z.infer<typeof UserSchema>