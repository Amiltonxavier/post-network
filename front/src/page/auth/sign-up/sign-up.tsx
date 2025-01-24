import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import { z } from "zod"
import { useForm } from "react-hook-form"


const signInForm = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(8),
  phone: z.string()
})

type SignFormProps = z.infer<typeof signInForm>

export function SignUp() {

   async function handleSignup() {
    
  }

  const { register, handleSubmit, formState: { isSubmitting } } =
    useForm<SignFormProps>({
      defaultValues: {
        //email: searchParams.get('email') ?? ''
      }
    })
  return (
    <>
   {/*  <Helmet title="Sign-up" /> */}
    <div className="p-8">
      <Button variant={"ghost"} asChild className="absolute right-4 top-8">
        <Link to={"/sign-in"}> Fazer login</Link>
      </Button>

      <div className="w-[320px] flex flex-col justify-center gap-6">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-3xl tracking-tight font-semibold">Criar conta grátis</h1>
          <p className="text-sm text-muted-foreground">Seja um parceiro e comece suas vendas!</p>
        </div>
        <form onSubmit={handleSubmit(handleSignup)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Seu e-mail</Label>
            <Input type="email" id="email" {...register('email')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Seu celular</Label>
            <Input type="tel" id="phone" {...register('phone')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="restaurantName">Sua Senha</Label>
            <Input type="password" id="password" {...register('password')} />
          </div>

          <Button disabled={isSubmitting} type="submit" className="w-full">
            Cadastra-se
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
