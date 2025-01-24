import axios from "axios";

import { LocalStorageManager } from "@/helper/storage";
import { signInType } from "@/schema/sign-in";
import { api } from "@/lib/axios";
import { userType } from "@/schema/user.schema";

type SignInResponseType = {
  token: string;
};

export class AuthenticationServices {
  private route = "" //CONSTANTE.ROUTER.PUBLIC.SIGNIN.api[0];
  private localStorageManager = new LocalStorageManager();

  async createSession({
    password,
    username,
  }: signInType): Promise<SignInResponseType | null> {
    try {
      const response = await api.post(`/login`, { password, username });
      return { token: response.data.token };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw new Error(`${error.response?.data.message}`);
      } else {
        throw new Error("Erro desconhecido");
      }
    }
  }

  async validate(): Promise<userType | null> {
    try {
      const response = await api.get("/me");
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`${error}`);
      }
    }

    return null;
  }

  async signOut() {
    // biome-ignore lint/complexity/useLiteralKeys: <explanation>
    api.defaults.headers.common["Authorization"] = undefined;
  }

  async refreshToken() {
    try {
      const refreshToken = this.localStorageManager.get();
      const response = await api.post("", {
        token: refreshToken,
      });
      return response.data.token;
    } catch (error) {
      return null;
    }
  }
}
