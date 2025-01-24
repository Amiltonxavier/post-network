import { api } from "@/lib/axios";
import { CreateUserType, ProfileFormData } from "@/schema/user.schema";

export interface CreateCommentRequest {
    postId: number;
    content: string;
  }

export class UserService{

    async update  (userId: number, data: ProfileFormData): Promise<ProfileFormData> {
        const response = await api.put<ProfileFormData>(`/users/${userId}`, data);
        return response.data;
      };

      async create  (data: CreateUserType): Promise<void>{
         await api.post<CreateUserType>(`/register`, data);
        
      };

}