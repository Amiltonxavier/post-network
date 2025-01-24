import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link, useNavigate } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { UserSchema, CreateUserType } from "@/schema/user.schema"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { UserService } from "@/services/user.service"




export function SignUp() {
  const router = useNavigate()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserType>({
    resolver: zodResolver(UserSchema)
   });

    const userService = new UserService();

  async function onsubmit(data: CreateUserType) {
    try {
      await userService.create(data); // Substitua `user.id` pelo identificador correto
      toast.success("Perfil atualizado com sucesso!");
      router("/sign-in")
      reset();
    } catch (error) {
      console.error("Erro ao atualizar o perfil:", error);
      toast.error("Erro ao Cadastrar usuário");
    }
  }


  return (
    <>
   <Helmet title="Sign-up" /> 
    <div className="p-8">
      <Button variant={"ghost"} asChild className="absolute right-4 top-8">
        <Link to={"/sign-in"}> Fazer login</Link>
      </Button>

      <div className="w-[320px] flex flex-col justify-center gap-6">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-3xl tracking-tight font-semibold">Criar conta grátis</h1>
          <p className="text-sm text-muted-foreground">Partilha os seus pensamentos mais íntimos!</p>
        </div>
        <form onSubmit={handleSubmit(onsubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Seu nome de usuário</Label>
            <Input type="text" id="username" {...register('username')} />
            {errors.username && (
                  <span className="text-sm text-rose-500">
                    {errors.username.message}
                  </span>
                )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="fullName">Seu nome completo</Label>
            <Input type="text" id="fullName" {...register('fullName')} />
            {errors.fullName && (
                  <span className="text-sm text-rose-500">
                    {errors.fullName.message}
                  </span>
                )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">imgUrl</Label>
            <Input type="url" id="bio" {...register('imgUrl')} />
            {errors.imgUrl && (
                  <span className="text-sm text-rose-500">
                    {errors.imgUrl.message}
                  </span>
                )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Input type="text" id="bio" {...register('bio')} />
            {errors.bio && (
                  <span className="text-sm text-rose-500">
                    {errors.bio.message}
                  </span>
                )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="restaurantName">Sua Senha</Label>
            <Input type="password" id="password" {...register('password')} />
          </div>

          <Button disabled={isSubmitting} type="submit" className="w-full">
            {
              isSubmitting ? <> <Loader2 className="animate-spin h-4 w-4" /> Cadastrando... </> : "Cadastra-se"
            }
          </Button>
          <p className="px-6 text-center text-xs leading-relaxed text-muted-foreground">
            Ao continuar, você concorda com o
            nossos <a className="underline underline-offset-4" href="#">
              termos de serviços
            </a>  e{' '}
            <a className="underline underline-offset-4" href="#">
              políticas de privacidade</a>.
          </p>
        </form>
      </div>
    </div>
  </>
  )
}
