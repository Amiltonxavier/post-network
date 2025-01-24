import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link, useNavigate } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import { useForm } from "react-hook-form"
import { signInSchema, signInType } from "@/schema/sign-in"
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { useAuth } from "@/hooks/userAuth"


export function SignIn() {

    const router = useNavigate()
  const { signIn } = useAuth()


    const { register, handleSubmit, formState: { errors, isLoading } } = useForm<signInType>({
        resolver: zodResolver(signInSchema),
    })

    const { mutateAsync } = useMutation({
        mutationFn: async (data: signInType) => await signIn(data),
        mutationKey: ['sign-in']
    })

    const onsubmit = async (data: signInType) => {
        try {
            await mutateAsync(data)
            router(`/app`)
        } catch (error) {
            toast.error('Você não tem permissão para acessar esse recurso');
        }
    }

  return (
    <>
 <Helmet title="Autenticação" />
    <div className="p-8">
      <Button variant={"ghost"} asChild className="absolute right-4 top-8">
        <Link to={"/sign-up"}> Cadastra-se</Link>
      </Button>
      <div className="w-[320px] flex flex-col justify-center gap-6">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-3xl tracking-tight font-semibold">Acessar o painel</h1>
          <p className="text-sm text-muted-foreground">Acompanhe suas vendas pelo o painel do parceiro</p>
        </div>
        <form onSubmit={handleSubmit(onsubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Seu Nome de usuário</Label>
            <Input type="username" id="username" {...register('username')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Seu senha</Label>
            <Input type="password" id="password" {...register('password')} />
          </div>

          <Button disabled={isLoading} type="submit" className="w-full">Entrar</Button>
        </form>
      </div>
    </div>
  </>
  )
}
