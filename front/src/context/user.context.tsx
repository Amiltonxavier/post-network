
import { userType } from "@/schema/user.schema";
import { createContext, type ReactNode, useContext, useState } from "react";


type UserContextType = {
    user: userType | null
    updateUser: (user: userType | null) => void
}
type UserProviderType = {
    children: ReactNode
}

export const UserContext = createContext({} as UserContextType);

export function UserProvider({ children }: UserProviderType) {
    const [user, setUser] = useState<userType | null>(null)

    function updateUser(user: userType | null) {
        setUser(_ =>
            user
                ? user
                : null
        );
    }

    return (
        <UserContext.Provider value={{ user, updateUser }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext);