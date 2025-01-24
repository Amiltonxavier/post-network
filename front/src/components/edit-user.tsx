import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/context/user.context";
import { ProfileFormData, profileSchema } from "@/schema/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { AvatarImage } from "@radix-ui/react-avatar";
import { useForm } from "react-hook-form";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { toast } from "sonner";
import { ProfileService } from "@/services/user.service";
import { useAuth } from "@/hooks/userAuth";



export function EditDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { user,  } = useUser(); // Certifique-se de que `setUser` está disponível no contexto
  const { getUser} = useAuth()
  const profileService = new ProfileService();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user?.username ?? "",
      fullName: user?.fullName ?? "",
      bio: user?.bio ?? "",
      imgUrl: user?.imgUrl ?? "",
    },
  });

  async function onsubmit(data: ProfileFormData) {
    try {
      await profileService.update(user?.id, data); // Substitua `user.id` pelo identificador correto
      await getUser()
      toast.success("Perfil atualizado com sucesso!");
      onOpenChange(false); // Feche o diálogo
    } catch (error) {
      console.error("Erro ao atualizar o perfil:", error);
      toast("Erro ao atualizar o perfil");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
          <div className="flex items-center justify-center">
            <Avatar>
              <AvatarImage src={user?.imgUrl} alt={user?.fullName} />
              <AvatarFallback>{user?.fullName?.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
          <DialogDescription>
            Faça alterações no seu perfil aqui. Clique em salvar quando terminar.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onsubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fullName" className="text-right">
                Nome Completo
              </Label>
              <div className="flex flex-col gap-2 col-span-3">
                <Input id="fullName" {...register("fullName")} />
                {errors.fullName && (
                  <span className="text-sm text-rose-500">
                    {errors.fullName.message}
                  </span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Seu nome de usuário
              </Label>
              <div className="flex flex-col gap-2 col-span-3">
                <Input id="username" {...register("username")} />
                {errors.username && (
                  <span className="text-sm text-rose-500">
                    {errors.username.message}
                  </span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bio" className="text-right">
                Bio
              </Label>
              <div className="flex flex-col gap-2 col-span-3">
                <Input id="bio" {...register("bio")} />
                {errors.bio && (
                  <span className="text-sm text-rose-500">
                    {errors.bio.message}
                  </span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="imgUrl" className="text-right">
                Img Url
              </Label>
              <div className="flex flex-col gap-2 col-span-3">
                <Input id="imgUrl" {...register("imgUrl")} type="url" />
                {errors.imgUrl && (
                  <span className="text-sm text-rose-500">
                    {errors.imgUrl.message}
                  </span>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Guardar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
