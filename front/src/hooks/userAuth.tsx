
import { useUser } from "../context/user.context";
import { useNavigate } from "react-router-dom";

import type { signInType } from "../schema/sign-in";
import { LocalStorageManager } from "@/helper/storage";
import { AuthenticationServices } from "@/api/auth";

export const useAuth = () => {
    const localStorageManager = new LocalStorageManager()
    const authenticationServices = new AuthenticationServices();
    const { user, updateUser } = useUser()
    const isAuthenticated = !!user;
    const router = useNavigate();

    async function signOut() {
        const delay = (amount = 1500) => new Promise(resolve => setTimeout(resolve, amount))
        await delay();

        router(`/sign-in`, { replace: true });
        authenticationServices.signOut();
        localStorageManager.remove()
        updateUser(null)

    }

    async function signIn({ username, password }: signInType) {
        const response = await authenticationServices.createSession({ username, password });
        if (response?.token) {
            localStorageManager.save(response.token)
        }
    }
    function getUser() {
        return new Promise((resolve, reject) => {
            const token = localStorageManager.get();
            if (!token) {
                signOut();
                return reject({ message: 'Não está autenticado' });
            }
            authenticationServices.validate()
                .then((user) => {
                    if (user)
                        updateUser(user);
                    resolve(user)
                }).catch(() => {
                    reject(signOut())
                })
        })

    }

    return {
        signIn,
        isAuthenticated,
        getUser,
        signOut
    }
}


