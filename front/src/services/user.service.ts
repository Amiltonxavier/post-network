import { api } from "@/lib/axios";
import { ProfileFormData } from "@/schema/user.schema";

export interface CreateCommentRequest {
    postId: number;
    content: string;
  }

export class ProfileService{

    async update  (userId: number, data: ProfileFormData): Promise<ProfileFormData> {
        const response = await api.put<ProfileFormData>(`/users/${userId}`, data);
        return response.data;
      };

}