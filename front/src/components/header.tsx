
import { Network } from "lucide-react";
import { ThemeToggle } from "./theme/theme.toggle";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useUser } from "@/context/user.context";
import { useAuth } from "@/hooks/userAuth";

export function Header() {
    const { user } = useUser();
    const { signOut } = useAuth()
    return (
        <div className="border-b">

            <div className="flex h-16 items-center justify-between gap-6 px-6">

                <div className="flex items-center gap-2">
                <Network />
                <h2 className="text-xl font-bold">NetTalk</h2>
                </div>
             
                {/* SearchZone */}
                {/*        <Separator orientation="vertical" className="h-6" /> 
                <nav className="flex items-center space-x-4 lg:space-x-6">
                    <NavLink to="/" >
                        <Home className="size-4" />
                        Início
                    </NavLink>
                    <NavLink to={'/orders'}>
                        <UtensilsCrossed className="size-4" />
                        Pedidos
                    </NavLink>
                </nav>
*/}
                <div className="flex ml-auto items-center gap-2">
                    <ThemeToggle />
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Avatar>
                                <AvatarImage src={user?.imgUrl} alt={user?.fullName} />
                                <AvatarFallback>{user?.fullName?.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="bg-rose-500 text-white" onClick={signOut}>Sair</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    {/*  <AccountMenu /> */}
                </div>
            </div>
        </div>
    )
}